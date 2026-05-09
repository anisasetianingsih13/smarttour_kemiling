import 'package:flutter/material.dart';
import '../data/dummy_data.dart';
import '../models/tourism_place.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool isStarted = false;
  List<TourismPlace> filteredPlaces = [];

  @override
  void initState() {
    super.initState();
    filteredPlaces = dummyPlaces;
  }

  void _getRecommendation(String kondisiCuaca) {
    setState(() {
      if (kondisiCuaca == "Hujan") {
        filteredPlaces = dummyPlaces.where((place) => place.isIndoor).toList();
      } else {
        filteredPlaces = dummyPlaces;
      }
      isStarted = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7F6),
      body: isStarted ? _buildList() : _buildLanding(),
    );
  }

  // ================= 1. LANDING PAGE =================
  Widget _buildLanding() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ClipOval(
              child: Image.asset(
                'assets/images/logo.png',
                width: 180,
                height: 180,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 180, height: 180, color: Colors.grey[300], 
                  child: const Icon(Icons.image, size: 50),
                ),
              ),
            ),
            const SizedBox(height: 25),
            RichText(
              text: const TextSpan(
                children: [
                  TextSpan(
                    text: "SmartTour ",
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32)),
                  ),
                  TextSpan(
                    text: "Kemiling",
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFFD9822B)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              "Jelajahi tempat terbaik di Kemiling",
              style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.grey),
            ),
            const SizedBox(height: 30),
            ElevatedButton.icon(
              onPressed: () => _getRecommendation("Hujan"),
              icon: const Icon(Icons.location_on),
              label: const Text("Gunakan Lokasi Saya"),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6DB193),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= 2. REKOMENDASI LIST =================
  Widget _buildList() {
  return SafeArea(
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: Column(
        children: [
          // HEADER
          Row(
            children: [
              IconButton(
                onPressed: () => setState(() => isStarted = false),
                icon: const Icon(Icons.arrow_back, color: Color(0xFF1B3C59)),
              ),
              const Expanded(
                child: Text(
                  "Rekomendasi Wisata",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1B3C59)),
                ),
              ),
              const SizedBox(width: 48),
            ],
          ),

          // GRID DATA
          Expanded(
            child: GridView.builder(
              itemCount: filteredPlaces.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.65, // 🔥 Diperkecil angkanya supaya kartu lebih panjang ke bawah
              ),
              itemBuilder: (context, index) {
                final place = filteredPlaces[index];
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 🔥 BAGIAN GAMBAR (GANTI KE Image.asset)
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                        child: Image.asset( // <--- WAJIB Image.asset
                          place.imageUrl,
                          height: 100,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          // 🔥 Kalau masih gagal, munculkan ikon error biar kita tahu
                          errorBuilder: (context, error, stackTrace) {
                            print("Error loading image: $error"); // Cek di Debug Console
                            return Container(
                              height: 100,
                              color: Colors.grey[200],
                              child: const Icon(Icons.broken_image, color: Colors.red),
                            );
                          },
                        ),
                      ),
                      
                      Padding(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              place.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            const SizedBox(height: 5),
                            // DESKRIPSI (Dibatasi 3 baris biar rapi)
                            Text(
                              place.description,
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 10, color: Colors.grey),
                            ),
                            const SizedBox(height: 5),
                            Row(
                              children: [
                                const Icon(Icons.star, color: Colors.amber, size: 14),
                                const SizedBox(width: 4),
                                Text(place.rating.toString(), style: const TextStyle(fontSize: 12)),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      // TOMBOL DETAIL
                      Align(
                        alignment: Alignment.bottomRight,
                        child: Padding(
                          padding: const EdgeInsets.all(8),
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFD9822B),
                              minimumSize: const Size(60, 25),
                            ),
                            child: const Text("DETAIL", style: TextStyle(fontSize: 9)),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    ),
  );
}
}