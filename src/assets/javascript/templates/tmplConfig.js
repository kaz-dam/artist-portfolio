var makeup = require('../functions/Makeup');

function Picture(id, filePath, description, bgDark) {
	this.id = id;
	this.filePath = filePath;
	this.description = description;
	this.bgDark = bgDark;
}

makeup.prototype.pictures = [
	new Picture('1', 'wedding/wedding1.jpg', 'Treszkai Anett', false),
	new Picture('1', 'wedding/wedding2.jpg', 'Szabó Csilla - Csillagkép', false),
	new Picture('1', 'wedding/wedding3.jpg', 'Laca Soós - Photography', false),
	new Picture('1', 'wedding/wedding4.jpg', 'Gábor Gibbó Kiss - GibbóArt Photograpy', false),
	new Picture('1', 'wedding/wedding5.jpg', 'Bertók Video & Photo', false),
	new Picture('4', 'contest/contest1.jpg', 'Mátéfy Szabolcs - Sunbloom', false),
	new Picture('4', 'contest/contest2.jpg', 'Mátéfy Szabolcs - Meyer Eszter-Virág', false),
	new Picture('4', 'contest/contest3.jpg', 'Prokop Kata Sminkiskola sminkversenye', false),
	new Picture('2', 'fashion/fashion1.jpg', 'Bányai Bálint - Csorján Kriszta', false),
	new Picture('2', 'fashion/fashion2.jpg', 'Fotó Bazsa Kis-Horváth - Hári Hajna', false),
	new Picture('2', 'fashion/fashion3.jpg', 'Kaunitz Tamás - Tóth Alexandra', false),
	new Picture('2', 'fashion/fashion4.jpg', 'Nyers Attila - Styaszni Dorina - Siira kollekció 1', true),
	new Picture('2', 'fashion/fashion5.jpg', 'Nyers Attila - Styaszni Dorina - Siira kollekció 2', true),
	new Picture('2', 'fashion/fashion6.jpg', 'Nyers Attila - Tauber Kinga - Siira kollekció 1', true),
	new Picture('2', 'fashion/fashion7.jpg', 'Nyers Attila - Tauber Kinga - Siira kollekció 2', true),
	new Picture('2', 'fashion/fashion8.jpg', 'Zemse SAURIA kollekció - Mátéfy Szabolcs - Sztyehlik Ildikó', false),
	new Picture('2', 'fashion/fashion9.jpg', 'Zemse SAURIA kollekció - Mátéfy Szabolcs - Vencel Krisztina', false),
	new Picture('3', 'beauty/beauty1.jpg', 'Debreczi János - Debreczi János Fotográfia - Sándor Noémi', true),
	new Picture('3', 'beauty/beauty2.jpg', 'Gabriella Baranyi - Modell Viktoria Saletros', true),
	new Picture('3', 'beauty/beauty3.jpg', 'Mátéfy Szabolcs 1 (2) - Sunbloom', false),
	new Picture('3', 'beauty/beauty4.jpg', 'Mátéfy Szabolcs 1 (4) - Meyer Eszter-Virág', false),
	new Picture('3', 'beauty/beauty5.jpg', 'Mátéfy Szabolcs 1 (5) - Szűcs Krisztina', false),
	new Picture('3', 'beauty/beauty6.jpg', 'Szabo Miklos - Schellenberger Zsuzsanna', false),
	new Picture('3', 'beauty/beauty7.jpg', 'Sziszik Dániel - Fügedi Dóra Tímea', false)
]

module.exports = makeup;