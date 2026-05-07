class TourismPlace {
  final String name;
  final String category;
  final double rating;
  final String imageUrl;
  final bool isIndoor;
  final double lat;
  final double lng;

  TourismPlace({
    required this.name,
    required this.category,
    required this.rating,
    required this.imageUrl,
    required this.isIndoor,
    required this.lat, // Tambahkan di constructor
    required this.lng, // Tambahkan di constructor
  });
}