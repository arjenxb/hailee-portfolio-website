var inputReady = true;
var input = $('.404-input');
input.focus();
$('.container').on('click', function(e){
  input.focus();
});

input.on('keyup', function(e){
  $('.new-output').text(input.val());
  // console.log(inputReady);
});

$('.four-oh-four-form').on('submit', function(e){
  e.preventDefault();
  var val = $(this).children($('.404-input')).val().toLowerCase();
  var href;

	 if (val === 'eliş'){
    showKittens();
  }else {
    resetForm();
  }
});

function resetForm(withKittens){
  var message = "Geçersiz Kod! Lütfen kodu doğru girdiğinizden emin olun."
  var input = $('.404-input');

  if (withKittens){
    $('.arjen').removeClass('elis');
    message = "O YEAAHHH"
  }

  $('.new-output').removeClass('new-output');
  input.val('');
  $('.terminal').append('<p class="prompt">' + message + '</p><p class="prompt output new-output"></p>');

  $('.new-output').velocity(
    'scroll'
  ), {duration: 100}
}

	function showKittens(){
		$('.terminal').append("<div class='eliş'>" + "<p class='prompt'>Merhaba! Ben Arjen,</p>",
		"<p class='prompt'>Resmi bir tarih olmasada 25 Temmuz 2022'de beklenmedik bir şekilde karşıma çıkıp kısa bir sürede hayatımı renklendiren bir DOĞA PRENSESİ ile bir araya geldim</p>","<p class='prompt'>Gülümseyişi ile kalbimin atışını hızlandıran, gözleri ile dünyamı yeşerten, kokusu ile de beni rüyalarımın prensi yapan bu kıza Teşekkür Ediyorum.</p>","<p class='prompt'>Seni çok sevdiğimi ne olursa olsun hepde seveceğimi belirtmek istiyorum.</p>","<p class='prompt'>Selena Gomez - People You Know</p></div>");
		

		
		var lines = $('.arjen p');
		$.each(lines, function(index, line){
			setTimeout(function(){
				$(line).css({
					"opacity": 1
				});
//.kittens
				textEffect($(line))
			}, index * 100);
		});

		$('.new-output').velocity(
			'scroll'
		), {duration: 100}

		setTimeout(function(){
			var gif;

			$.get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=kittens', function(result){
				gif = result.data.image_url;
				$('.terminal').append('<img class="kitten-gif" src="' + gif + '"">');
				resetForm(true);
			});
		}, (lines.length * 100) + 1000);
	}

	function textEffect(line){
		var alpha = [';', '.', ',', ':', ';', '~', '`'];
		var animationSpeed = 10;
		var index = 0;
		var string = line.text();
		var splitString = string.split("");
		var copyString = splitString.slice(0);

		var emptyString = copyString.map(function(el){
		    return [alpha[Math.floor(Math.random() * (alpha.length))], index++];
		})

		emptyString = shuffle(emptyString);

		$.each(copyString, function(i, el){
		    var newChar = emptyString[i];
		    toUnderscore(copyString, line, newChar);

		    setTimeout(function(){
		      fromUnderscore(copyString, splitString, newChar, line);
		    },i * animationSpeed);
		  })
	}

	function toUnderscore(copyString, line, newChar){
		copyString[newChar[1]] = newChar[0];
		line.text(copyString.join(''));
	}

	function fromUnderscore(copyString, splitString, newChar, line){
		copyString[newChar[1]] = splitString[newChar[1]];
		line.text(copyString.join(""));
	}


	function shuffle(o){
	    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	};