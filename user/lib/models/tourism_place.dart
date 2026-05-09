class TourismPlace {
  final String name;
  final String category;
  final double rating;
  final String imageUrl;   // Foto utama (HD) untuk kartu & detail
  final bool isIndoor;
  final double lat;
  final double lng;
  final String description; // Penjelasan/deskripsi tempat

  TourismPlace({
    required this.name,
    required this.category,
    required this.rating,
    required this.imageUrl,
    required this.isIndoor,
    required this.lat,
    required this.lng,
    required this.description,
  });
}