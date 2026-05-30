import 'tourism_place.dart';
import 'weather_detail.dart';

class RecommendationResponse {
  final bool success;
  final String weather;
  final String source;
  final List<TourismPlace> recommendations;
  final WeatherDetail? weatherDetail;

  RecommendationResponse({
    required this.success,
    required this.weather,
    required this.source,
    required this.recommendations,
    this.weatherDetail,
  });

  factory RecommendationResponse.fromJson(Map<String, dynamic> json) {
    WeatherDetail? detail;
    if (json['metadata'] != null && json['metadata']['weather_detail'] != null) {
      detail = WeatherDetail.fromJson(json['metadata']['weather_detail']);
    } else if (json['weatherDetail'] != null) {
      detail = WeatherDetail.fromJson(json['weatherDetail']);
    }

    var recsList = json['recommendations'] as List? ?? [];
    List<TourismPlace> recs = recsList
        .map((item) => TourismPlace.fromJson(item as Map<String, dynamic>))
        .toList();

    return RecommendationResponse(
      success: json['success'] as bool? ?? false,
      weather: json['weather'] as String? ?? '',
      source: json['source'] as String? ?? '',
      recommendations: recs,
      weatherDetail: detail,
    );
  }
}
