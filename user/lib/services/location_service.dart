import 'package:geolocator/geolocator.dart';

class LocationService {
  Future<Position> getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled.
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Layanan lokasi (GPS) dinonaktifkan di perangkat Anda. Harap aktifkan GPS Anda.');
    }

    // Check location permission.
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      print('GPS Request: Requesting location permission...');
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Izin akses lokasi ditolak oleh pengguna.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception(
          'Izin lokasi ditolak permanen. Harap aktifkan izin lokasi secara manual di pengaturan perangkat Anda.');
    }

    // Retrieve high accuracy position.
    return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
  }
}
