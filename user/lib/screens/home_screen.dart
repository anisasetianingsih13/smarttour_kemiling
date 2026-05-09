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
                width: 160,
                height: 160,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 160, height: 160, color: Colors.grey[300],
                  child: const Icon(Icons.image, size: 50),
                ),
              ),
            ),
            const SizedBox(height: 20),
            RichText(
              text: const TextSpan(
                children: [
                  TextSpan(
                    text: "SmartTour ",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32)),
                  ),
                  TextSpan(
                    text: "Kemiling",
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFFD9822B)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 25),
            ElevatedButton.icon(
              onPressed: () => _getRecommendation("Cerah"),
              icon: const Icon(Icons.location_on),
              label: const Text("Cek Rekomendasi"),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6DB193),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
            ),
          ],
        ),
      ),
    );
  }

 Widget _buildList() {
  return SafeArea(
    child: Column(
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.all(10),
          child: Row(
            children: [
              IconButton(
                onPressed: () => setState(() => isStarted = false),
                icon: const Icon(Icons.arrow_back),
              ),
              const Text(
                "Wisata Kemiling",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: filteredPlaces.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              // 🔥 KUNCINYA DI SINI: Angka ini harus besar (1.3 - 1.5)
              childAspectRatio: 1.3, 
            ),
            itemBuilder: (context, index) {
              final place = filteredPlaces[index];
              return Card(
                elevation: 2,
                clipBehavior: Clip.antiAlias,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                child: Column(
                  // 🔥 TAMBAHKAN INI: Biar kolomnya nggak maruk ruang
                  mainAxisSize: MainAxisSize.min, 
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Gambar (Tingginya dikunci)
                    Image.asset(
                      place.imageUrl,
                      height: 80, // 🔥 Jangan kasih lebih dari ini
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (c, e, s) => Container(height: 80, color: Colors.grey[200]),
                    ),
                    
                    // 2. Konten (Hapus Deskripsi biar gak molor)
                    Padding(
                      padding: const EdgeInsets.all(6.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            place.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text("⭐ ${place.rating}", style: const TextStyle(fontSize: 10)),
                              // Tombol Detail dibuat kecil/teks aja biar gak makan tempat
                              Text(
                                "DETAIL >",
                                style: TextStyle(
                                  color: Colors.orange[800], 
                                  fontSize: 9, 
                                  fontWeight: FontWeight.bold
                                ),
                              ),
                            ],
                          ),
                        ],
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