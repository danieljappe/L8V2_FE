#Ideas:

## Gallery

### Upload

Meta data på billede object

({
    imageId: processedImage.id,
    filename: file.originalname,
    paths: {
    original: processedImage.original,
    thumbnail: processedImage.sizes.thumbnail,
    medium: processedImage.sizes.medium,
    large: processedImage.sizes.large
    },
    metadata: processedImage.metadata,
    event: {
    name: eventName,
    date: eventDate,
    venue: venue
    },
    artists: artists ? artists.split(',').map(a => a.trim()) : [],
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    photographer: photographer
});
