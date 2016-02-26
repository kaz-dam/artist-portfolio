<!DOCTYPE html>
<html lang="hu">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Ha egyedi, különleges vagy alkalmi sminket szeretnél legyen az alkalom fotózás, esküvő vagy csak egy rendezvény. Bábics Tímea - Sminkes">
	<meta name="keywords" content="smink, sminkes, makeup, esküvői smink, menyasszonyi smink, smink fotózásra, alkalmi smink, egyedi smink, divatsmink, divatsminkes, fantázia smink, party smink">
	<meta name="author" content="Bábics Tímea">
	<title>TiMakeup - Bábics Tímea, sminkes</title>

	<!-- favicon for Chrome, Firefox, Safari -->
	<link rel="icon" href="icons/favicon.ico">

	<!-- favicon for IE -->
	<!--[if IE]><link rel="shortcut icon" href="icons/favicon.ico"><![endif]-->

	<link rel="stylesheet" href="style/fonts.css">
	<link rel="stylesheet" href="style/reset.css">
	<link rel="stylesheet" href="style/main.css">
</head>
<body>
	<div class="slider-wrapper">
		<ul class="slider">
			<li class="visible">

<?php
	include 'views/header.php';

	include 'views/about.php';

	include 'views/jobs.php';

	include 'views/references.php';

	include 'views/contact.php';

	include 'views/footer.php';
?>

				<div class="scroll-menu">
					<?php include 'icons/arrow.php'; ?>

					<ul class="side-menu">
						<li><a href="#header"><span>T</span>op</a></li>
						<li><a href="#about"><span>R</span>ólam</a></li>
						<li><a href="#jobs"><span>M</span>unkák</a></li>
						<li><a href="#references"><span>R</span>eferenciák</a></li>
						<li><a href="#contact"><span>K</span>apcsolat</a></li>
					</ul>
				</div>
			</li>
			<li class="gallery" id="gallery-rendered"> <!-- **** one list item is enough to load the different galleries dynamically **** -->
			</li>
		</ul>
		<?php include 'views/gallery.php'; ?>
		<?php include 'views/svg-cover.php'; ?>
	</div>
	<script src="node_modules/jquery/dist/jquery.min.js"></script>
	<script src="node_modules/handlebars/dist/handlebars.min.js"></script>
	<script src="node_modules/auto-loader/index.js"></script>
	<script src="js/slow-scroll.js"></script>
	<script src="js/snap.svg.js"></script>
	<script src="js/main.js"></script>
	<script src="js/gallery-tmpl.js"></script>
</body>
</html>