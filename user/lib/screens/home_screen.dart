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
    padding: EdgeInsets.all(12),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Rekomendasi Wisata",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1B3C59),
          ),
        ),

        SizedBox(height: 10),

        Expanded(
          child: GridView.builder(
            itemCount: dummyPlaces.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, // 🔥 JADI 3
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 0.9, // 🔥 disesuaikan biar ga gepeng
            ),
            itemBuilder: (context, index) {
              final place = dummyPlaces[index];

              return Container(
                decoration: BoxDecoration(
                  color: Color(0xFF2D6A9F),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Column(
                  children: [
                    // 🔥 GAMBAR
                    ClipRRect(
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(15),
                      ),
                      child: Image.network(
                        place.imageUrl,
                        height: 80,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 80,
                            color: Colors.grey[300],
                            child: Icon(Icons.image, size: 30),
                          );
                        },
                      ),
                    ),

                    SizedBox(height: 6),

                    // 🔥 NAMA (dibikin kecil biar muat)
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 6),
                      child: Text(
                        place.name,
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                    Spacer(),

                    // 🔥 BUTTON KECIL
                    Padding(
                      padding: EdgeInsets.only(bottom: 6),
                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                              horizontal: 10, vertical: 5),
                          backgroundColor: Colors.white,
                          foregroundColor: Color(0xFF2D6A9F),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                        ),
                        child: Text(
                          "Detail",
                          style: TextStyle(fontSize: 10),
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