import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SmartTour Kemiling',

      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6DB193), // 🌿 warna soft green
          brightness: Brightness.light,
        ),

        scaffoldBackgroundColor: const Color(0xFFF5F7F6), // background soft

        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),

        textTheme: const TextTheme(
          bodyMedium: TextStyle(fontSize: 14),
        ),
      ),

      home: HomeScreen(),
    );
  }
}