import 'package:flutter/material.dart';
import '../data/dummy_data.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool isStarted = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7F6),
      body: isStarted ? _buildList() : _buildLanding(),
    );
  }

  // ================= LANDING PAGE =================
  Widget _buildLanding() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // LOGO
            ClipOval(
              child: Image.asset(
                'assets/images/logo.png',
                width: 180,
                height: 180,
                fit: BoxFit.cover,
              ),
            ),

            const SizedBox(height: 25),

            // TEXT 2 WARNA
            RichText(
              text: const TextSpan(
                children: [
                  TextSpan(
                    text: "SmartTour ",
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2E7D32),
                    ),
                  ),
                  TextSpan(
                    text: "Kemiling",
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFD9822B),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // TAGLINE
            const Text(
              "Jelajahi tempat terbaik di Kemiling",
              style: TextStyle(
                fontSize: 14,
                fontStyle: FontStyle.italic,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 30),

            // BUTTON
            ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  isStarted = true;
                });
              },
              icon: const Icon(Icons.location_on),
              label: const Text("Gunakan Lokasi Saya"),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6DB193),
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= GRID LIST =================
  Widget _buildList() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          // 🔥 HEADER: Maksa judul di tengah pakai teknik Row + Expanded
          Row(
            children: [
              // Tombol Back di kiri
              IconButton(
                onPressed: () {
                  setState(() {
                    isStarted = false;
                  });
                },
                icon: const Icon(
                  Icons.arrow_back,
                  color: Color(0xFF1B3C59),
                  size: 28,
                ),
              ),
              
              // Ini kuncinya: Expanded + Center biar teksnya makan ruang sisa dan di tengah
              Expanded(
                child: Container(
                  margin: const EdgeInsets.only(right: 48), // Angka 48 ini lebar IconButton supaya center-nya presisi
                  child: const Text(
                    "Rekomendasi Wisata",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1B3C59),
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 15),

          Expanded(
            child: GridView.builder(
              itemCount: dummyPlaces.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 0.7, // Disesuaikan biar card-nya cakep di layar
              ),
              itemBuilder: (context, index) {
                final place = dummyPlaces[index];

                return Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF2D6A9F),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    children: [
                      // GAMBAR
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                        child: Image.network(
                          place.imageUrl,
                          height: 70,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => 
                            Container(height: 70, color: Colors.grey[300], child: const Icon(Icons.image)),
                        ),
                      ),

                      const SizedBox(height: 4),

                      // NAMA
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Text(
                          place.name,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),

                      const Spacer(),

                      // TOMBOL
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF2D6A9F),
                            minimumSize: const Size(60, 25),
                            padding: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          child: const Text("Detail", style: TextStyle(fontSize: 9)),
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