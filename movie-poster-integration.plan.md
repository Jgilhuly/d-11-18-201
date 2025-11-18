<!-- ac06ffde-ee7d-40c7-a101-3e1d5a559220 dd2f5924-8798-4b08-ad23-f23360253ece -->
# Movie Poster Integration Plan

## Research Findings

### Available APIs and Sources

1. **The Movie Database (TMDb) API** (Recommended)

- Free for non-commercial use with proper attribution
- Comprehensive movie/TV database with high-quality posters
- Endpoint: `/movie/{movie_id}/images` returns posters, backdrops, logos
- Image base URL: `https://image.tmdb.org/t/p/{size}/{file_path}`
- Already partially integrated (image.tmdb.org whitelisted in next.config.ts)
- Requires API key registration at themoviedb.org

2. **OMDb API**

- Provides poster URLs via movie title or IMDb ID
- Free tier available (limited requests)
- Simpler but less comprehensive than TMDb

3. **Alternative Sources**

- CineMaterial: Digital archive with 1M+ posters
- AI-powered tools for custom poster generation (fallback option)

### Libraries Found

- **TMDB Wrapper** (`/api-wrappers/tmdb-wrapper`) - TypeScript wrapper for TMDB API
- **tmdb-ts** (`/blakejoy/tmdb-ts`) - TypeScript library with JWT auth
- Python libraries available but not suitable for Next.js/TypeScript stack

## Current State

- Content model already has `posterUrl` field (string, nullable)
- Manual poster URL input in `CreateContentDialog.tsx`
- Existing download script (`scripts/download-posters.js`) uses hardcoded TMDB URLs
- Next.js config already allows `image.tmdb.org` as image hostname
- Posters stored in `public/posters/` directory

## Parallel Implementation Tracks

### Track 1: TMDB API Service Infrastructure
**Status:** Independent - Can start immediately  
**Dependencies:** None  
**Deliverables:**
- Install TMDB client library or create custom API client
- Create `src/lib/services/tmdb.ts` with core API functions
- Add environment variable setup (`.env.local` with `TMDB_API_KEY`)
- Implement: `searchMovie(title)`, `getMoviePosters(movieId)`, `getMovieDetails(movieId)`
- Add rate limiting (40 requests per 10 seconds)
- Error handling and retry logic
- TypeScript types for TMDB API responses

**Files to Create/Modify:**
- `src/lib/services/tmdb.ts` (new)
- `.env.local` (new, gitignored)
- `.env.example` (new, document TMDB_API_KEY)
- `package.json` (add TMDB dependency if using library)

**Acceptance Criteria:**
- Can search movies by title
- Can fetch movie posters by movie ID
- Rate limiting prevents API abuse
- Proper error handling for API failures
- TypeScript types for all API responses

---

### Track 2: MovieSearch UI Component
**Status:** Can start in parallel with Track 1 (mock TMDB service initially)  
**Dependencies:** Track 1 (for final integration, but can use mocks during development)  
**Deliverables:**
- Create `src/components/content/MovieSearch.tsx`
- Debounced search input (300-500ms delay)
- Display search results with poster thumbnails
- Loading states and empty states
- Selection handler that returns selected movie data
- Responsive design matching existing UI patterns
- Internationalization support (use LocaleContext)

**Files to Create/Modify:**
- `src/components/content/MovieSearch.tsx` (new)
- `src/lib/locale-strings.ts` (add movie search strings)

**Acceptance Criteria:**
- Debounced search prevents excessive API calls
- Search results display with poster thumbnails
- Clicking a result selects it and closes results
- Loading spinner during search
- Empty state when no results found
- Responsive and accessible
- All strings use locale system

---

### Track 3: CreateContentDialog Integration
**Status:** Depends on Track 2 (MovieSearch component)  
**Dependencies:** Track 2 (MovieSearch component)  
**Deliverables:**
- Integrate MovieSearch component into CreateContentDialog
- Add poster preview when URL is entered (show image thumbnail)
- Add "Fetch from TMDB" button next to poster URL field
- Auto-populate poster URL when movie is selected from search
- Keep manual URL input as fallback option
- Enhance form validation for poster URLs

**Files to Create/Modify:**
- `src/components/content/CreateContentDialog.tsx` (modify)
- `src/lib/locale-strings.ts` (add dialog strings if needed)

**Acceptance Criteria:**
- MovieSearch component integrated above poster URL field
- Selecting a movie auto-fills poster URL
- Poster preview shows thumbnail when URL is valid
- Manual URL input still works as fallback
- "Fetch from TMDB" button allows manual poster fetch
- Form validation works with both manual and auto-filled URLs

---

### Track 4: Poster Management Utilities
**Status:** Can start in parallel with Track 1 (needs TMDB service)  
**Dependencies:** Track 1 (TMDB service)  
**Deliverables:**
- Create `src/lib/utils/poster-fetcher.ts`
- Functions to fetch posters from TMDB
- Functions to download posters locally to `public/posters/`
- Batch operations for fetching posters for multiple movies
- Error handling and retry logic
- Cache management (avoid re-downloading existing posters)

**Files to Create/Modify:**
- `src/lib/utils/poster-fetcher.ts` (new)

**Acceptance Criteria:**
- Can fetch poster URL from TMDB for a movie
- Can download poster image to local filesystem
- Batch operations handle multiple movies efficiently
- Skips downloading if poster already exists locally
- Proper error handling for network failures
- Returns local path or TMDB URL based on preference

---

### Track 5: Download Script Enhancement
**Status:** Can start in parallel with Track 4 (needs poster utilities)  
**Dependencies:** Track 4 (poster utilities), Track 1 (TMDB service)  
**Deliverables:**
- Convert `scripts/download-posters.js` to TypeScript (`scripts/download-posters.ts`)
- Integrate TMDB API for dynamic poster fetching
- Query database for all content items
- Fetch missing posters from TMDB based on content name
- Download posters locally or use TMDB URLs
- Add CLI options for different modes (local vs remote URLs)

**Files to Create/Modify:**
- `scripts/download-posters.ts` (convert from .js)
- `scripts/download-posters.js` (delete after conversion)
- `package.json` (update script command if needed)

**Acceptance Criteria:**
- Script queries database for all content
- Searches TMDB for each content item by name
- Downloads missing posters or updates posterUrl field
- Can run in "local download" or "URL only" mode
- Proper error handling and logging
- TypeScript types throughout

---

### Track 6: Fallback & Error Handling
**Status:** Can start after Track 1 is complete  
**Dependencies:** Track 1 (TMDB service)  
**Deliverables:**
- Implement OMDb API fallback service
- Add placeholder image handling when no poster found
- Cache search results locally (localStorage or in-memory)
- Enhanced error messages for users
- Retry logic with exponential backoff

**Files to Create/Modify:**
- `src/lib/services/omdb.ts` (new, optional fallback)
- `src/lib/services/tmdb.ts` (enhance with fallback logic)
- `src/components/content/MovieSearch.tsx` (add fallback UI)
- `public/placeholder-poster.svg` or `.png` (new, if needed)

**Acceptance Criteria:**
- If TMDB search fails, tries OMDb API
- Shows placeholder image when no poster available
- Caches search results to reduce API calls
- User-friendly error messages
- Graceful degradation when APIs unavailable

---

## Implementation Sequence

### Phase 1: Foundation (Parallel)
- **Track 1** (TMDB Service) - Start immediately
- **Track 2** (MovieSearch Component) - Start in parallel, use mocks initially
- **Track 4** (Poster Utilities) - Start after Track 1 is 50% complete

### Phase 2: Integration (Sequential)
- **Track 3** (CreateContentDialog) - Start after Track 2 is complete
- **Track 5** (Download Script) - Start after Track 4 is complete

### Phase 3: Enhancement (Parallel)
- **Track 6** (Fallbacks) - Start after Track 1 is complete, can run in parallel with Phase 2

## Shared Dependencies

### Environment Variables
- `TMDB_API_KEY` - Required for Track 1, 4, 5, 6
- `OMDB_API_KEY` - Optional for Track 6

### Locale Strings
All tracks that add UI must add strings to:
- `src/lib/locale-strings.ts` (both `englishStrings` and `spanishStrings`)

### Common Patterns
- Use `useLocalizedStrings()` hook for all user-facing text
- Follow existing component patterns (see `CreateContentDialog.tsx`)
- Use existing UI components from `src/components/ui/`

## Questions to Resolve

1. Should posters be downloaded and stored locally, or use TMDB URLs directly?
2. Do we need bulk poster fetching for existing content, or just for new content?
3. Should we implement OMDb as a fallback, or TMDB only?
4. What poster size should we use? (w500, w780, original)

## Track Status Checklist

### Track 1: TMDB API Service Infrastructure
- [ ] Install TMDB client library or create custom API client
- [ ] Create `src/lib/services/tmdb.ts`
- [ ] Add environment variable setup
- [ ] Implement searchMovie function
- [ ] Implement getMoviePosters function
- [ ] Implement getMovieDetails function
- [ ] Add rate limiting
- [ ] Add error handling
- [ ] Add TypeScript types

### Track 2: MovieSearch UI Component
- [ ] Create `src/components/content/MovieSearch.tsx`
- [ ] Add debounced search input
- [ ] Display search results with thumbnails
- [ ] Add loading states
- [ ] Add empty states
- [ ] Add selection handler
- [ ] Add locale strings
- [ ] Test responsive design

### Track 3: CreateContentDialog Integration
- [ ] Integrate MovieSearch component
- [ ] Add poster preview
- [ ] Add "Fetch from TMDB" button
- [ ] Auto-populate poster URL on selection
- [ ] Keep manual URL input
- [ ] Update form validation

### Track 4: Poster Management Utilities
- [ ] Create `src/lib/utils/poster-fetcher.ts`
- [ ] Add fetch poster from TMDB function
- [ ] Add download poster locally function
- [ ] Add batch operations
- [ ] Add error handling
- [ ] Add cache management

### Track 5: Download Script Enhancement
- [ ] Convert to TypeScript
- [ ] Add database query for content
- [ ] Integrate TMDB API
- [ ] Add poster fetching logic
- [ ] Add CLI options
- [ ] Add error handling

### Track 6: Fallback & Error Handling
- [ ] Create OMDb service (optional)
- [ ] Add fallback logic to TMDB service
- [ ] Add placeholder image handling
- [ ] Add caching for search results
- [ ] Enhance error messages
- [ ] Add retry logic

