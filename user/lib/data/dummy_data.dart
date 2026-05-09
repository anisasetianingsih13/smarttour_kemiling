import '../models/tourism_place.dart';

List<TourismPlace> dummyPlaces = [
  TourismPlace(
    name: "Kopi Ketje Kemiling",
    category: "Kuliner",
    rating: 4.8,
    // Menggunakan foto yang kamu kirim tadi (setelah didaftarkan di assets)
    imageUrl: "assets/images/wisata/kopi_ketje.png", 
    isIndoor: true,
    lat: -5.3971,
    lng: 105.2662,
    description: "Kopi Ketje Kemiling merupakan tempat nongkrong populer yang menawarkan suasana modern dengan sentuhan industrial. Tempat ini sangat cocok untuk bersantai saat cuaca hujan karena memiliki area indoor yang nyaman, pilihan kopi yang beragam, dan pelayanan yang ramah.", 
  ),
  TourismPlace(
    name: "Bukit Sakura",
    category: "Wisata Alam",
    rating: 4.7,
    imageUrl: "assets/images/wisata/bukit_sakura.png",
    isIndoor: false,
    lat: -5.4012,
    lng: 105.2550,
    description: "Destinasi wisata keluarga dengan tema unik ala Jepang di Lampung. Pengunjung dapat menikmati keindahan bunga sakura buatan, menyewa kimono, dan melihat pemandangan seluruh kota Bandar Lampung dari atas bukit.",
  ),
  TourismPlace(
    name: "Taman Kupu-Kupu Gita Persada",
    category: "Edukasi",
    rating: 4.6,
    imageUrl: "assets/images/wisata/taman_kupu.png",
    isIndoor: false,
    lat: -5.4050,
    lng: 105.2400,
    description: "Taman konservasi yang didekasikan untuk perlindungan berbagai jenis kupu-kupu khas Lampung. Tempat wisata edukasi yang sejuk dan asri, sangat cocok untuk memperkenalkan alam kepada anak-anak.",
  ),
];