import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/recommendation_response.dart';

class ApiService {
  static const int _timeoutSeconds = 15;

  static String get _baseUrl {
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3002';
      }
    } catch (_) {
      // In case of web platform or others where Platform.isAndroid might throw or not apply
    }
    return 'http://localhost:3002';
  }

  Future<RecommendationResponse> getRecommendations(double lat, double lng) async {
    final url = Uri.parse('$_baseUrl/api/recommendation?lat=$lat&lng=$lng');
    print('API Request URL: $url');

    try {
      final response = await http
          .get(url)
          .timeout(const Duration(seconds: _timeoutSeconds));

      print('API Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonMap = json.decode(response.body);
        return RecommendationResponse.fromJson(jsonMap);
      } else {
        throw HttpException('Server error (Status Code: ${response.statusCode})');
      }
    } on SocketException catch (e) {
      throw Exception('Gagal menghubungi backend (Connection error). Pastikan server menyala di $_baseUrl dan terhubung. ($e)');
    } on HttpException catch (e) {
      throw Exception(e.message);
    } on FormatException catch (e) {
      throw Exception('Format respon tidak valid: $e');
    } on TimeoutException {
      throw Exception('Permintaan waktu habis (Timeout). Koneksi ke server di $_baseUrl terlalu lambat.');
    } catch (e) {
      throw Exception('Kesalahan tidak terduga: $e');
    }
  }
}
