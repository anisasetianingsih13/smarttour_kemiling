class WeatherDetail {
  final String condition;
  final String description;
  final double temp;

  WeatherDetail({
    required this.condition,
    required this.description,
    required this.temp,
  });

  factory WeatherDetail.fromJson(Map<String, dynamic> json) {
    return WeatherDetail(
      condition: json['condition'] as String? ?? '',
      description: json['description'] as String? ?? '',
      temp: (json['temp'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
