convert-image:
	convert -density 1200 -background none icon/icon.svg icon/icon.png
	convert icon/icon.png -resize 16x16 icon/icon_16x16.png
	convert icon/icon.png -resize 48x48 icon/icon_48x48.png
	convert icon/icon.png -resize 128x128 icon/icon_128x128.png
