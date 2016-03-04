var makeup = require('../functions/Makeup');

function Picture(id, filePath, description, bgDark) {
	this.id = id;
	this.filePath = filePath;
	this.description = description;
	this.bgDark = bgDark;
}

makeup.prototype.pictures = [
	new Picture('w', 'wedding/wedding1.jpg', 'Treszkai Anett', false),
	new Picture('w', 'wedding/wedding2.jpg', 'Szabó Csilla - Csillagkép', false)
	new Picture('w', 'wedding/wedding3.jpg', 'Laca Soós - Photography', false),
	new Picture('w', 'wedding/wedding4.jpg', 'Gábor Gibbó Kiss - GibbóArt Photograpy', false),
	new Picture('w', 'wedding/wedding5.jpg', 'Bertók Video &amp; Photo', false),
	new Picture('c', 'contest/contest1.jpg', 'Mátéfy Szabolcs - Sunbloom', false),
	new Picture('c', 'contest/contest2.jpg', 'Mátéfy Szabolcs - Meyer Eszter-Virág', false),
	new Picture('c', 'contest/contest3.jpg', 'Prokop Kata Sminkiskola sminkversenye', false),
	new Picture('f', 'fashion/fashion1.jpg', 'Bányai Bálint - Csorján Kriszta', false),
	new Picture('f', 'fashion/fashion2.jpg', 'Fotó Bazsa Kis-Horváth - Hári Hajna', false),
	new Picture('f', 'fashion/fashion3.jpg', 'Kaunitz Tamás - Tóth Alexandra', false),
	new Picture('f', 'fashion/fashion4.jpg', 'Nyers Attila - Styaszni Dorina - Siira kollekció 1', true),
	new Picture('f', 'fashion/fashion5.jpg', 'Nyers Attila - Styaszni Dorina - Siira kollekció 2', true),
	new Picture('f', 'fashion/fashion6.jpg', 'Nyers Attila - Tauber Kinga - Siira kollekció 1', true),
	new Picture('f', 'fashion/fashion7.jpg', 'Nyers Attila - Tauber Kinga - Siira kollekció 2', true),
	new Picture('f', 'fashion/fashion8.jpg', 'Zemse SAURIA kollekció - Mátéfy Szabolcs - Sztyehlik Ildikó', false),
	new Picture('f', 'fashion/fashion9.jpg', 'Zemse SAURIA kollekció - Mátéfy Szabolcs - Vencel Krisztina', false),
	new Picture('b', 'beauty/beauty1.jpg', 'Debreczi János - Debreczi János Fotográfia - Sándor Noémi', true),
	new Picture('b', 'beauty/beauty2.jpg', 'Gabriella Baranyi - Modell Viktoria Saletros', true),
	new Picture('b', 'beauty/beauty3.jpg', 'Mátéfy Szabolcs 1 (2) - Sunbloom', false),
	new Picture('b', 'beauty/beauty4.jpg', 'Mátéfy Szabolcs 1 (4) - Meyer Eszter-Virág', false),
	new Picture('b', 'beauty/beauty5.jpg', 'Mátéfy Szabolcs 1 (5) - Szűcs Krisztina', false),
	new Picture('b', 'beauty/beauty6.jpg', 'Szabo Miklos - Schellenberger Zsuzsanna', false),
	new Picture('b', 'beauty/beauty7.jpg', 'Sziszik Dániel - Fügedi Dóra Tímea', false)
]

module.exports = makeup;