import 'package:flutter/material.dart';
import '../data/dummy_data.dart';

class HomeScreen extends StatefulWidget {
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool isStarted = false; // untuk pindah tampilan

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("SmartTour Kemiling"),
      ),
      body: isStarted ? _buildList() : _buildLanding(),
    );
  }

  // 🔹 Tampilan awal (ADA LOGO)
  Widget _buildLanding() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 🔥 LOGO DI SINI
            ClipOval(
              child: Image.asset(
                'assets/images/logo.png',
                width: 120,
                height: 120,
                fit: BoxFit.cover,
              ),
            ),

            SizedBox(height: 20),

            Text(
              "SmartTour Kemiling",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),

            SizedBox(height: 10),

            Text(
              "Jelajahi tempat terbaik di Kemiling",
              textAlign: TextAlign.center,
            ),

            SizedBox(height: 30),

            ElevatedButton(
              onPressed: () {
                setState(() {
                  isStarted = true; // pindah ke list
                });
              },
              child: Text("Gunakan Lokasi Saya"),
            ),
          ],
        ),
      ),
    );
  }

  // 🔹 List wisata (yang kamu buat tadi)
  Widget _buildList() {
    return ListView.builder(
      itemCount: dummyPlaces.length,
      itemBuilder: (context, index) {
        final place = dummyPlaces[index];

        return Card(
          margin: EdgeInsets.all(10),
          child: ListTile(
            leading: Image.network(place.imageUrl),
            title: Text(place.name),
            subtitle: Text("${place.category} • ⭐ ${place.rating}"),
            trailing:
                place.isIndoor ? Icon(Icons.home) : Icon(Icons.park),
          ),
        );
      },
    );
  }
}