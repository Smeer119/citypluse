import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Crosshair, X } from 'lucide-react';
import { geocodeAddress, getCurrentLocation, GeocodingResult } from '@/lib/Geocoding';

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  initialAddress?: string;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialAddress = '', 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [predictions, setPredictions] = useState<Array<{ description: string; place_id: string }>>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteWidgetRef = useRef<any>(null);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(false);
    setPredictions([]);
    setSearchResults([]);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce autocomplete predictions (prefer suggestions over immediate geocode)
    if (value.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchPredictions(value.trim());
      }, 300);
    }
  };

  // Perform geocoding search (fallback when no predictions)
  const performSearch = async (query: string, autoSelect: boolean = false) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(false);

    try {
      const result = await geocodeAddress(query);
      
      if ('error' in result) {
        console.error('Geocoding error:', result.message);
        setSearchResults([]);
      } else {
        setSearchResults([result]);
        setPredictions([]);
        if (autoSelect) {
          // immediately select the geocode result
          const location = {
            address: result.formattedAddress,
            coordinates: { lat: result.lat, lng: result.lng }
          };
          setSelectedLocation(location);
          onLocationSelect(location);
          setSearchQuery(result.formattedAddress);
          setShowResults(false);
        } else {
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize Places services
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService();
      }
      if (!placesServiceRef.current) {
        const dummyDiv = document.createElement('div');
        placesServiceRef.current = new (window as any).google.maps.places.PlacesService(dummyDiv);
      }
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new (window as any).google.maps.places.AutocompleteSessionToken();
      }

      // Bind the official Google Autocomplete UI to the input for reliable suggestions
      if (inputRef.current && !autocompleteWidgetRef.current) {
        try {
          autocompleteWidgetRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
            types: ['(cities)'],
            fields: ['geometry.location', 'formatted_address', 'place_id'],
          });
          autocompleteWidgetRef.current.addListener('place_changed', () => {
            const place = autocompleteWidgetRef.current.getPlace();
            if (place && place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const address = place.formatted_address || inputRef.current?.value || '';
              const selection = { address, coordinates: { lat, lng } };
              setSelectedLocation(selection);
              onLocationSelect(selection);
              setSearchQuery(address);
              setShowResults(false);
            } else if (inputRef.current?.value) {
              // Fallback: geocode typed text
              performSearch(inputRef.current.value, true);
            }
          });
        } catch (err) {
          // If widget fails, we'll rely on manual predictions/geocode
          // eslint-disable-next-line no-console
          console.warn('Autocomplete widget init failed:', err);
        }
      }
    }
  }, []);

  // If we receive an initial address, pre-select it by geocoding once
  useEffect(() => {
    if (initialAddress && !selectedLocation) {
      performSearch(initialAddress, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAddress]);

  // Fetch autocomplete predictions (cities prioritized)
  const fetchPredictions = (input: string) => {
    if (!autocompleteServiceRef.current) {
      // Fallback to geocoding if Places is not ready
      performSearch(input, true);
      return;
    }

    setIsSearching(true);
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input,
        sessionToken: sessionTokenRef.current,
        // The JS SDK doesn't always honor types: ['(cities)'] but we can still pass it; we'll filter client-side as well
        types: ['(cities)'],
      },
      (preds: any[] | null) => {
        setIsSearching(false);
        if (!preds || preds.length === 0) {
          setPredictions([]);
          // As a fallback, try geocode results
          performSearch(input, true);
          return;
        }
        // Map minimal info for UI
        const mapped = preds.map((p: any) => ({ description: p.description, place_id: p.place_id }));

        // If user's input exactly matches a prediction (case-insensitive), auto-select it
        const exact = mapped.find((p) => p.description.toLowerCase() === input.toLowerCase());
        if (exact) {
          handlePredictionSelect(exact.place_id, exact.description);
          return;
        }

        // Heuristic: if the top suggestion's city name (before first comma) matches the input, auto-select top
        const top = mapped[0];
        if (top) {
          const topCity = top.description.split(',')[0].trim().toLowerCase();
          const inputCity = input.trim().toLowerCase();
          if (topCity === inputCity) {
            handlePredictionSelect(top.place_id, top.description);
            return;
          }
        }
        setPredictions(mapped);
        setShowResults(true);
      }
    );
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsSearching(true);
    
    try {
      const result = await getCurrentLocation();
      
      if ('error' in result) {
        console.error('Geolocation error:', result.message);
        // You could show a toast notification here
        return;
      }

      // Reverse geocode to get address
      const geocodeResult = await geocodeAddress(`${result.lat}, ${result.lng}`);
      
      if ('error' in geocodeResult) {
        // Use coordinates as fallback
        const location = {
          address: `${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}`,
          coordinates: result
        };
        setSelectedLocation(location);
        onLocationSelect(location);
        setSearchQuery(location.address);
      } else {
        const location = {
          address: geocodeResult.formattedAddress,
          coordinates: { lat: geocodeResult.lat, lng: geocodeResult.lng }
        };
        setSelectedLocation(location);
        onLocationSelect(location);
        setSearchQuery(location.address);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection from search results
  const handleLocationSelect = (result: GeocodingResult) => {
    const location = {
      address: result.formattedAddress,
      coordinates: { lat: result.lat, lng: result.lng }
    };
    
    setSelectedLocation(location);
    onLocationSelect(location);
    setSearchQuery(result.formattedAddress);
    setShowResults(false);
  };

  // Select a predicted place by place_id
  const handlePredictionSelect = (placeId: string, description: string) => {
    if (!placesServiceRef.current) return;

    setIsSearching(true);
    placesServiceRef.current.getDetails(
      {
        placeId,
        fields: ['geometry.location', 'formatted_address'],
        sessionToken: sessionTokenRef.current,
      },
      (place: any, status: any) => {
        setIsSearching(false);
        if (!place || !place.geometry || !place.geometry.location) {
          // Fallback: try geocoding the description
          performSearch(description);
          return;
        }
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || description;
        const selection = { address, coordinates: { lat, lng } };
        setSelectedLocation(selection);
        onLocationSelect(selection);
        setSearchQuery(address);
        setShowResults(false);
      }
    );
  };

  // Clear selected location
  const handleClearLocation = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    onLocationSelect({ address: '', coordinates: { lat: 0, lng: 0 } });
  };

  // Handle manual search
  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  // Handle Enter: geocode and immediately select without opening the dropdown
  const handleEnterKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setShowResults(false);
    try {
      if (predictions.length > 0) {
        // Choose the top prediction
        const top = predictions[0];
        handlePredictionSelect(top.place_id, top.description);
      } else {
        const result = await geocodeAddress(query);
        if ('error' in result) {
          console.error('Geocoding error:', result.message);
          return;
        }
        const location = {
          address: result.formattedAddress,
          coordinates: { lat: result.lat, lng: result.lng }
        };
        setSelectedLocation(location);
        onLocationSelect(location);
        setSearchQuery(result.formattedAddress);
      }
    } catch (error) {
      console.error('Enter select error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor="location">Location *</Label>
      
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="location"
              placeholder="Search for an address or landmark..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              onKeyDown={handleEnterKey}
              ref={inputRef}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                onClick={handleClearLocation}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isSearching}
            className="px-3"
          >
            <Crosshair className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Results Dropdown: Prefer Places predictions; fallback to geocode results */}
        {showResults && (predictions.length > 0 || searchResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            {predictions.map((p) => (
              <button
                key={p.place_id}
                className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors"
                onClick={() => handlePredictionSelect(p.place_id, p.description)}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{p.description}</div>
                    <div className="text-xs text-muted-foreground">Place suggestion</div>
                  </div>
                </div>
              </button>
            ))}
            {predictions.length === 0 && searchResults.map((result) => (
              <button
                key={result.placeId}
                className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors"
                onClick={() => handleLocationSelect(result)}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{result.formattedAddress}</div>
                    <div className="text-xs text-muted-foreground">
                      {result.lat.toFixed(6)}, {result.lng.toFixed(6)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-muted/30 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <div className="font-medium text-sm">{selectedLocation.address}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!selectedLocation && (
        <p className="text-xs text-muted-foreground">
          Enter an address or use the location button to get your current position. 
          You can also search for landmarks or intersections.
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
