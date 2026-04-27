import 'package:flutter/material.dart';
import '../data/dummy_data.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("SmartTour Kemiling"),
      ),
      body: ListView.builder(
        itemCount: dummyPlaces.length,
        itemBuilder: (context, index) {
          final place = dummyPlaces[index];

          return Card(
            margin: EdgeInsets.all(10),
            child: ListTile(
              leading: Image.network(place.imageUrl),
              title: Text(place.name),
              subtitle: Text("${place.category} • ⭐ ${place.rating}"),
              trailing: place.isIndoor
                  ? Icon(Icons.home)
                  : Icon(Icons.park),
            ),
          );
        },
      ),
    );
  }
}