# week-2-assignment

 Bir sonraki derse hazırlıklı gelebilmeniz adına sizlere ARGE ödevi vermeye karar verdik. Bu repo üzerinde klasörlerinizi/dosyalarınızı oluşturup çalışabilirsiniz. 

 ## Yapmanız gereken maddeler;

* Http modülü ile bir web server oluşturalım.
* Client tarafından gönderilen request’leri; talep edilen url’lere yönlendirip (Ana Sayfa, Hakkımızda vs.) ekranda “… sayfasındasınız”  gibi bir mesaj verelim.

* Gelen her request’i FS modülünü kullanarak bir dosyada loglayalım.

* Tanımlı olmayan url’ler için gelen her request’i de 404 uyarısı ile yönlendirip mesaj gösterelim.


NOTE: Node modules gibi büyük dosyaları github'a pushlamamanız için bir .gitignore dosyası eklemeyi de unutmayın.

 ## Yapılan işler;

* Http modülü ile bir web server 8080 portuna açıldı
* Gelen isteklerin loglanması tamamlandı
* Gelen isteklerde talep edilen sayfalar repo içerisindeki 'pages/' klasörü içindeki dosyalardan temin edildi. Bu klasör içinde olan dosyalar FS ile okunup isteğe cevap olarak sunulurken, bulunamayan dosyalard 404-Not Found mesajı verildi
* İstek dosyasını okuma async bir şekilde yapılırken, loglama işlemi 'rwlock' modülü ile critical-section olarak ayarlandı
