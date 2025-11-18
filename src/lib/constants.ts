export const PRIORITIES = [
  { value: 'LOW', labelKey: 'priorityLow' as const, color: 'bg-green-500/20 text-green-400' },
  { value: 'MEDIUM', labelKey: 'priorityMedium' as const, color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'HIGH', labelKey: 'priorityHigh' as const, color: 'bg-orange-500/20 text-orange-400' },
  { value: 'CRITICAL', labelKey: 'priorityCritical' as const, color: 'bg-red-500/20 text-red-400' },
] as const

export const getPriorities = (strings: { contentRequests: { lowPriority: string; mediumPriority: string; highPriority: string; criticalPriority: string } }) => {
  const labelMap: Record<string, string> = {
    LOW: strings.contentRequests.lowPriority,
    MEDIUM: strings.contentRequests.mediumPriority,
    HIGH: strings.contentRequests.highPriority,
    CRITICAL: strings.contentRequests.criticalPriority
  }
  return PRIORITIES.map(priority => ({
    ...priority,
    label: labelMap[priority.value] || priority.value
  }))
}

export const CONTENT_REQUEST_STATUSES = [
  { value: 'PENDING', labelKey: 'statusPending' as const, color: 'bg-blue-500/20 text-blue-400' },
  { value: 'IN_REVIEW', labelKey: 'statusInReview' as const, color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'APPROVED', labelKey: 'statusApproved' as const, color: 'bg-green-500/20 text-green-400' },
  { value: 'ADDED', labelKey: 'statusAdded' as const, color: 'bg-muted text-muted-foreground' },
] as const

export const getContentRequestStatuses = (strings: { contentRequests: { pendingStatus: string; inReviewStatus: string; approvedStatus: string; addedStatus: string } }) => {
  const labelMap: Record<string, string> = {
    PENDING: strings.contentRequests.pendingStatus,
    IN_REVIEW: strings.contentRequests.inReviewStatus,
    APPROVED: strings.contentRequests.approvedStatus,
    ADDED: strings.contentRequests.addedStatus
  }
  return CONTENT_REQUEST_STATUSES.map(status => ({
    ...status,
    label: labelMap[status.value] || status.value
  }))
}

export const CONTENT_STATUSES = [
  { value: 'AVAILABLE', labelKey: 'statusAvailable' as const, color: 'bg-green-500/20 text-green-400' },
  { value: 'FEATURED', labelKey: 'statusFeatured' as const, color: 'bg-purple-500/20 text-purple-400' },
  { value: 'ARCHIVED', labelKey: 'statusArchived' as const, color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'REMOVED', labelKey: 'statusRemoved' as const, color: 'bg-muted text-muted-foreground' },
] as const

export const getContentStatuses = (strings: { content: { available: string; featured: string; archived: string; removed: string } }) => {
  const labelMap: Record<string, string> = {
    AVAILABLE: strings.content.available,
    FEATURED: strings.content.featured,
    ARCHIVED: strings.content.archived,
    REMOVED: strings.content.removed
  }
  return CONTENT_STATUSES.map(status => ({
    ...status,
    label: labelMap[status.value] || status.value
  }))
}

export const CONTENT_GENRES = [
  { value: 'MOVIE', labelKey: 'genreMovie' as const },
  { value: 'SERIES', labelKey: 'genreSeries' as const },
  { value: 'DOCUMENTARY', labelKey: 'genreDocumentary' as const },
  { value: 'SHORT', labelKey: 'genreShort' as const },
  { value: 'SPECIAL', labelKey: 'genreSpecial' as const },
  { value: 'OTHER', labelKey: 'genreOther' as const },
] as const

export const getContentGenres = (strings: { contentRequests: { genreMovie: string; genreSeries: string; genreDocumentary: string; genreShort: string; genreSpecial: string; genreOther: string } }) => {
  const labelMap: Record<string, string> = {
    MOVIE: strings.contentRequests.genreMovie,
    SERIES: strings.contentRequests.genreSeries,
    DOCUMENTARY: strings.contentRequests.genreDocumentary,
    SHORT: strings.contentRequests.genreShort,
    SPECIAL: strings.contentRequests.genreSpecial,
    OTHER: strings.contentRequests.genreOther
  }
  return CONTENT_GENRES.map(genre => ({
    ...genre,
    label: labelMap[genre.value] || genre.value
  }))
}

export const CONTENT_TYPES = [
  { value: 'MOVIE', labelKey: 'typeMovie' as const },
  { value: 'TV_SERIES', labelKey: 'typeTvSeries' as const },
  { value: 'DOCUMENTARY', labelKey: 'typeDocumentary' as const },
  { value: 'SHORT_FILM', labelKey: 'typeShortFilm' as const },
  { value: 'SPECIAL', labelKey: 'typeSpecial' as const },
  { value: 'ORIGINAL', labelKey: 'typeOriginal' as const },
  { value: 'OTHER', labelKey: 'typeOther' as const },
] as const

export const getContentTypes = (strings: { content: { typeMovie: string; typeTvSeries: string; typeDocumentary: string; typeShortFilm: string; typeSpecial: string; typeOriginal: string; typeOther: string } }) => {
  const labelMap: Record<string, string> = {
    MOVIE: strings.content.typeMovie,
    TV_SERIES: strings.content.typeTvSeries,
    DOCUMENTARY: strings.content.typeDocumentary,
    SHORT_FILM: strings.content.typeShortFilm,
    SPECIAL: strings.content.typeSpecial,
    ORIGINAL: strings.content.typeOriginal,
    OTHER: strings.content.typeOther
  }
  return CONTENT_TYPES.map(type => ({
    ...type,
    label: labelMap[type.value] || type.value
  }))
}
