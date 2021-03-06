var canvas = Raphael("canvas", 1000, 667);
canvas.customAttributes.arc = function (xloc, yloc, value, total, R) {
  var alpha = 360 / total * value,
      a = (90 - alpha) * Math.PI / 180,
      x = xloc + R * Math.cos(a),
      y = yloc - R * Math.sin(a),
      path;
  if (total == value) {
    path = [
      ["M", xloc, yloc - R],
      ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
    ];
  } else {
    path = [
      ["M", xloc, yloc - R],
      ["A", R, R, 0, +(alpha > 180), 1, x, y]
    ];
  }
  return {
    path: path
  };
};
canvas.customAttributes.after = function(){

};


var music_value = 180;
var news_value = 90;
var comedy_value = 45;
var audiobooks_value = 45;

var music_color = "#f00";
var news_color = "#0000FF";
var comedy_color = "#ffff00";
var audiobooks_color = "#BF5FFF";

var x_translate  = 80;
var y_translate = 600;

var circles =  canvas.set();

var background = canvas.path().attr({
  "stroke": "#D3D3D3",
  "stroke-width": 120,
  arc: [0, 0, 360, 360, 100],
  after: undefined
});
background.translate(x_translate,y_translate);


/**
 * Music
 */
var music = canvas.path().attr({
  "stroke": music_color,
  "stroke-width": 120,
  'stroke-opacity': 0.5,
  arc: [0, 0, 0, 360, 100]
});
music.translate(x_translate,y_translate);

circles.push(music);
music.animate({
  arc: [0, 0, music_value, 360, 100],
}, 1500, "bounce");

/**
 * News
 */
var news  = canvas.path().attr({
  "stroke": news_color,
  "stroke-width": 120,
  'stroke-opacity': 0.5,
  arc: [0, 0, 0, 360, 100],
});
circles.push(news);
news.translate(x_translate,y_translate);
news.rotate(music_value,0,0)

news.animate({
  arc: [0, 0, news_value, 360, 100]
}, 1500, "bounce");


/**
 * Comedy
 */
var comedy  = canvas.path().attr({
  "stroke": comedy_color,
  "stroke-width": 120,
  'stroke-opacity': 0.5,
  arc: [0, 0, 0, 360, 100],
});
circles.push(comedy);
comedy.translate(x_translate,y_translate);
comedy.rotate(music_value + news_value,0,0)

comedy.animate({
  arc: [0, 0, comedy_value, 360, 100]
}, 1500, "bounce");


/**
 * Audiobooks
 */
var audiobooks  = canvas.path().attr({
  "stroke": audiobooks_color,
  "stroke-width": 120,
  'stroke-opacity': 0.5,
  arc: [0, 0, 0, 360, 100],
});
circles.push(audiobooks);
audiobooks.translate(x_translate,y_translate);
audiobooks.rotate(comedy_value + music_value + news_value,0,0)

audiobooks.animate({
  arc: [0, 0, audiobooks_value, 360, 100]
}, 1500, "bounce");





music.attr({
  after: news
});
news.attr({
  after: comedy
});
comedy.attr({
  after: audiobooks
});
audiobooks.attr({
  after: music
});



function increasePercent(start_circle) {
  start_circle.attr({
    arc: [0, 0, start_circle.attrs.arc[2]+1, 360, 100]
  });
  var number_of_peaces = circles.length-1;
  circles.forEach(function (circle) {
    if (circle.attrs.arc[2] <= 0) {
      number_of_peaces = number_of_peaces -1
    }
  })
  var factor_decrease = 1 / number_of_peaces;
  var i = number_of_peaces;

  var circle = start_circle;
  while (i>0){
    circle = circle.attrs.after;
    if (circle.attrs.arc[2] > 0){
      circle.attr({
        arc: [0, 0, circle.attrs.arc[2]-factor_decrease, 360, 100]
      });
    }
    circle.rotate(i/number_of_peaces,0,0);
    i--
  }


}
/**
 * Buttons
 *
 */

var pressInterval = null;

function createButton(src, start_circle, color) {
  group  = canvas.set();
  img = canvas.image(src, 180,0,50,50);
  bbox = img.getBBox();
  circle = canvas.circle(bbox.x + bbox.width/2,bbox.y + bbox.height/2,bbox.height/2 +20);
  circle.attr({
    fill: color,
    'fill-opacity': 0.5,
  });
  img.toFront();



  group.push(img);
  group.push(circle );

  group.mousedown(function () {
    if (pressInterval){
      clearInterval(pressInterval)
    }
    pressInterval = setInterval(function(){
      increasePercent(start_circle)
    }, 20);

  });
  group.mouseup(function () {
    if (pressInterval){
      clearInterval(pressInterval)
    }else {
      console.error("Wrong state")
    }
  });

  return group;
}

var musicIcon = createButton("./src/music-icon.svg", music, music_color);
var news = createButton("./src/newspaper-icon.svg", news, news_color);
var audiobooks  = createButton("./src/audiobook-icon.svg", audiobooks, audiobooks_color);
var comedy  = createButton("./src/theater-masks-icon.svg", comedy, comedy_color);
musicIcon.translate(100,100);
news.translate(100,200);
audiobooks.translate(100,300);
comedy.translate(100,400);


music.node.onclick = function () {
  my_arc.rotate(10, 0,0)
};