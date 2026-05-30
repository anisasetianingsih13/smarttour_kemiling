class TourismPlace {
  final int id;
  final String name;
  final String description;
  final String category;
  final bool isIndoor;
  final double latitude;
  final double longitude;
  final double rating;
  final String? imageUrl;
  final double distance;

  TourismPlace({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.isIndoor,
    required this.latitude,
    required this.longitude,
    required this.rating,
    this.imageUrl,
    required this.distance,
  });

  factory TourismPlace.fromJson(Map<String, dynamic> json) {
    return TourismPlace(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      category: json['category'] as String? ?? '',
      isIndoor: json['isIndoor'] is bool
          ? json['isIndoor'] as bool
          : (json['isIndoor'] == 1 || json['isIndoor'] == 'true' || json['isIndoor'] == 'Indoor'),
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      imageUrl: json['imageUrl'] as String?,
      distance: (json['distance'] as num?)?.toDouble() ?? 0.0,
    );
  }
}