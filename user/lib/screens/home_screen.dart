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

  void _getRecommendation() {
    setState(() {
      filteredPlaces = dummyPlaces;
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

  // ================= 1. TAMPILAN LANDING (LOGO + JUDUL + SUBTITLE + TOMBOL) =================
  Widget _buildLanding() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Logo Lingkaran
          Container(
            width: 200,
            height: 200,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              image: DecorationImage(
                image: AssetImage('assets/images/logo.png'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Tulisan SmartTour Kemiling
          RichText(
            text: const TextSpan(
              children: [
                TextSpan(
                  text: "SmartTour ",
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32)),
                ),
                TextSpan(
                  text: "Kemiling",
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFFD9822B)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          // Subtitle
          const Text(
            "Jelajahi tempat terbaik di Kemiling",
            style: TextStyle(fontSize: 14, color: Colors.black87),
          ),
          const SizedBox(height: 35),
          // Tombol Gunakan Lokasi Saya
          SizedBox(
            width: 300,
            height: 55,
            child: ElevatedButton.icon(
              onPressed: _getRecommendation,
              icon: const Icon(Icons.location_on, color: Colors.black, size: 26),
              label: const Text(
                "Gunakan Lokasi Saya",
                style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.w500),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF94D0B4),
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ================= 2. TAMPILAN LIST (KOTAK PENDEK + DESKRIPSI FULL SCROLLABLE) =================
  Widget _buildList() {
    return SafeArea(
      child: Column(
        children: [
          // Header Judul Tengah
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
            child: Row(
              children: [
                IconButton(
                  onPressed: () => setState(() => isStarted = false),
                  icon: const Icon(Icons.arrow_back),
                ),
                const Expanded(
                  child: Center(
                    child: Text(
                      "Rekomendasi Wisata di Kemiling",
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(width: 48),
              ],
            ),
          ),
          
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 15),
              itemCount: filteredPlaces.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.7, // 🔥 SEDIKIT DITURUNKAN biar kotak agak lega buat tulisan gede
              ),
              itemBuilder: (context, index) {
                final place = filteredPlaces[index];
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Gambar Wisata
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                        child: Image.asset(
                          place.imageUrl,
                          height: 100, // 🔥 Gambar dibesarin dikit biar gak kekecilan
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (c, e, s) => Container(height: 100, color: Colors.grey[200]),
                        ),
                      ),
                      
                      // Area Teks yang Scrollable
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(10.0), // 🔥 Padding dibesarin
                          child: SingleChildScrollView(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  place.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold, 
                                    fontSize: 15, // 🔥 NAMA TEMPAT DIBESARIN
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: Colors.amber, size: 16),
                                    Text(
                                      " ${place.rating}", 
                                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500), // 🔥 RATING DIBESARIN
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                // DESKRIPSI FULL
                                Text(
                                  place.description,
                                  style: const TextStyle(
                                    fontSize: 12, // 🔥 DESKRIPSI DIBESARIN (dari 9 ke 12)
                                    color: Colors.black87,
                                    height: 1.3, // Kasih jarak antar baris biar enak dibaca
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Tombol DETAIL Oranye
                      Align(
                        alignment: Alignment.bottomRight,
                        child: Container(
                          margin: const EdgeInsets.only(right: 10, bottom: 10),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD9822B),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            "DETAIL",
                            style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
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
    );
  }
}