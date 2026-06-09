import 'package:flutter/material.dart';
import 'package:introduction_screen/introduction_screen.dart';
import 'package:lottie/lottie.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'home_screen.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  Future<void> _completeOnboarding(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isFirstTime', false);
    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
      );
    }
  }

  Widget _buildImage(String url, IconData fallbackIcon) {
    return Center(
      child: SizedBox(
        width: 250,
        height: 250,
        child: Lottie.network(
          url,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Color(0x0C000000),
                    blurRadius: 16,
                  ),
                ],
              ),
              child: Icon(
                fallbackIcon,
                size: 100,
                color: const Color(0xFF6DB193),
              ),
            );
          },
          frameBuilder: (context, child, composition) {
            if (composition == null) {
              return Container(
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  fallbackIcon,
                  size: 100,
                  color: const Color(0xFF6DB193),
                ),
              );
            }
            return child;
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const pageDecoration = PageDecoration(
      titleTextStyle: TextStyle(
        fontSize: 24.0,
        fontWeight: FontWeight.bold,
        color: Color(0xFF1E293B),
      ),
      bodyTextStyle: TextStyle(
        fontSize: 15.0,
        color: Color(0xFF64748B),
        height: 1.5,
      ),
      imagePadding: EdgeInsets.only(top: 80, bottom: 20),
      pageColor: Color(0xFFF5F7F6),
    );

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7F6),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 800),
          child: IntroductionScreen(
            pages: [
              PageViewModel(
                title: 'Jelajahi Kemiling',
                body: 'Temukan destinasi wisata alam dan kuliner terbaik di Kemiling, Bandar Lampung dengan mudah.',
                image: _buildImage(
                  'https://assets5.lottiefiles.com/packages/lf20_5n8ybyzu.json',
                  Icons.map_rounded,
                ),
                decoration: pageDecoration,
              ),
              PageViewModel(
                title: 'Rekomendasi Pintar Cuaca',
                body: 'Tidak perlu khawatir kehujanan! Kami merekomendasikan tempat wisata terbaik (Indoor/Outdoor) menyesuaikan kondisi cuaca Anda secara real-time.',
                image: _buildImage(
                  'https://assets10.lottiefiles.com/packages/lf20_1xx1z8wq.json',
                  Icons.cloud_sync_rounded,
                ),
                decoration: pageDecoration,
              ),
              PageViewModel(
                title: 'Mulai Petualanganmu',
                body: 'Simpan tempat favoritmu dan temukan rute tercepat ke lokasi. Siap untuk menjelajah?',
                image: _buildImage(
                  'https://assets4.lottiefiles.com/packages/lf20_j1adxtyb.json',
                  Icons.rocket_launch_rounded,
                ),
                decoration: pageDecoration,
              ),
            ],
            onDone: () => _completeOnboarding(context),
            onSkip: () => _completeOnboarding(context),
            showSkipButton: true,
            skip: const Text(
              'Lewati',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Color(0xFF6DB193),
              ),
            ),
            next: const Icon(
              Icons.arrow_forward_rounded,
              color: Color(0xFF6DB193),
            ),
            done: const Text(
              'Mulai',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Color(0xFF6DB193),
              ),
            ),
            dotsDecorator: DotsDecorator(
              size: const Size.fromRadius(4),
              activeSize: const Size(20.0, 8.0),
              activeColor: const Color(0xFF6DB193),
              color: const Color(0xFFCBD5E1),
              activeShape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(5.0),
              ),
            ),
            globalBackgroundColor: const Color(0xFFF5F7F6),
          ),
        ),
      ),
    );
  }
}
