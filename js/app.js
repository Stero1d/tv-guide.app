document.addEventListener('DOMContentLoaded', () => {
    const { utils } = window.core;
    const arrayDaysWeek = ['ПТ','СБ','ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС','ПН','ВТ','СР','ЧТ'];
    const arrTextMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const arrTextDay = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const currentDayMonth = (new Date()).getDate();
    const date = new Date();
    const dayWeek = date.getDay();
    //Грузим и  парсим JSON.
    utils.load('model/channels.json', (response) => {
        loadPrograms(JSON.parse(response))
    })

    function loadPrograms(channels) {
        utils.load('model/programs.json', (response) => {
            mergeData(channels, JSON.parse(response))
        })
    }
    //Осуществляем объединение JSON объектов по одинаковому значению поля epg_channel_id и channel_id
    function mergeData(channels, programs) {
        const programsLength = programs.collection.length;
        const channelsLength = channels.collection.length;
        let clickKol = 0;
		for (let i = 0; i < channelsLength; i++) {
            const newObjChannels = []; 
			for (let k = 0; k < programsLength; k++) {
				if (channels.collection[i].epg_channel_id === programs.collection[k].channel_id) {
                    newObjChannels.push(programs.collection[k]);
				}
			}
		  channels.collection[i].epg_channel_id = newObjChannels;
        }
        let groupChannels = [];
        for (let i = 0; i < 6; i++) {
            groupChannels.push(channels.collection[i]); 
        }

        showData(groupChannels);
        //Осуществляем переход по страницам, вытаскивая нужные нам данные
        $('.next').on( 'click', function () {
            if (clickKol === Math.ceil((channels.collection.length) / 6)-1) {
                clickKol = 0;
                groupChannels = [];
                for (let i =clickKol * 6; i < clickKol * 6 + 6; i++) {
                    groupChannels.push(channels.collection[i]);
                }
                 utils.applyTemplate(
                    '#content', 
                    'template/channels.hbs',
                    {
                        groupChannels: groupChannels,
                    },
                    () => {
                        setProgramOnClickListeners();
                        setChannelOnClickListeners();
                    }
                )
            } else {
                clickKol++;
                groupChannels = [];
                for (let i =clickKol * 6; i < clickKol * 6 + 6; i++) {
                    groupChannels.push(channels.collection[i]);
                }
                 utils.applyTemplate(
                    '#content', 
                    'template/channels.hbs',
                    {
                        groupChannels: groupChannels,
                    },
                    () => {
                        setProgramOnClickListeners();
                        setChannelOnClickListeners();
                    }
                )
            }
            $('#train').removeClass('height-496');   
        })

        $('.prev').on( 'click', function () {
            clickKol--;
            groupChannels = [];
            if (clickKol >= 0) {
                for (let i = clickKol*6; i < clickKol * 6 + 6; i++) {
                    groupChannels.push(channels.collection[i]);
                }
                 utils.applyTemplate(
                    '#content', 
                    'template/channels.hbs',
                    {
                        groupChannels: groupChannels,
                        
                    },
                    () => {
                        setProgramOnClickListeners();
                        setChannelOnClickListeners();
                    }
                )
            } else {
                clickKol = Math.ceil((channels.collection.length) / 7);
                clickKol--;
                for (let i = (clickKol) * 6; i < (clickKol) * 6 + 6; i++) {
                    groupChannels.push(channels.collection[i]);
                }
                utils.applyTemplate(
                    '#content', 
                    'template/channels.hbs',
                    {
                        groupChannels: groupChannels,
                    },
                    () => {
                        setProgramOnClickListeners();
                        setChannelOnClickListeners();
                    }
                )
            }
            $('#train').removeClass('height-496');
        })

    //Отображаем шаблон с каналами.
	function showData(groupChannels) {
		 utils.applyTemplate(
			'#content', 
			'template/channels.hbs',
			{
				groupChannels: groupChannels,
			},
			() => {
				updateDate();
                updateDayWeek();
                updateTimeLine();
                setProgramOnClickListeners();
                setChannelOnClickListeners();
			}
		)
    }

    //Отображаем  слайдер линию текущего времени.
    function updateTimeLine() {
        let timer = setInterval(function() {
        // вычислить сколько времени прошло из opts.duration.
        let startSec = (new Date()).getSeconds(); // сохранить время начала.
        let startMin = (new Date).getMinutes();
        let currentSlaiderTimeline = 0;
        let sum = 0;
        const containerPrograms= $('.container-programs');
        const timeLine = 361;
        if (startMin > 29) {
            currentSlaiderTimeline = Math.ceil((((startMin - 30) * 60) + startSec) / (1800/timeLine));
        } else if (startMin <= 30) {
            currentSlaiderTimeline = Math.ceil(((startMin * 60) + startSec)/(1800 / timeLine));
        }	
        train.style.left = (171 + currentSlaiderTimeline) + 'px';
        treangle.style.left = (167.5 + currentSlaiderTimeline) + 'px';
        if ((new Date()).getMinutes() === 30) {
            sum++;
            containerPrograms.css('left', + -363 * sum + 'px')   
            clearInterval(timer);
        } else if ((new Date()).getMinutes() === 0) {
            sum++;
            containerPrograms.css('left', + -363 * sum + 'px')
            clearInterval(timer);
        }
        }, 5);
    }  
    }

	function setProgramOnClickListeners () {
		$('.programs').on('click', function() { 
			const $self = $(this);
			let selfDescription =  $('.program-description', $self).html();
			let thisDescription =  $('.program-description', $self).closest('.channels-programs').find('.description-visible');
            $('.description-visible').removeClass('visible');
            $('.img').removeClass('channel-active');
            $('.program-description', $self).closest('.channel').find('.img').addClass('channel-active');
			thisDescription.addClass('visible');
			thisDescription.html(selfDescription);
			$('#train').addClass('height-496');
			$('.program-name').removeClass('focus-program');
			$('.program-name', $self).addClass('focus-program');
		})      
    }
    
    function setChannelOnClickListeners () {
        $('.channel-title').on('click', function() { 
            const $self = $(this);
            $('.description-visible').removeClass('visible');
            $('.name').closest('.channel').find('.channel-title').removeClass('choice-channel');
            $('.img').removeClass('channel-active');
            let descriptionHidden =  $('.description', $self).html();
            $('.name', $self).closest('.channel').find('.channels-programs .description-visible').html(descriptionHidden);
            $('.name', $self).closest('.channel').find('.channels-programs .description-visible').addClass('visible');
            $('.program-name').removeClass('focus-program');
            $('#train').addClass('height-496');
            $('.program-name', $self).addClass('focus-program');
            $('.img', $self).addClass('channel-active');
            $('.name', $self).closest('.channel').find('.channel-title').addClass('choice-channel');
                    
        })
    }
  
	//Функция обновления даты/времени/временной шкалы.
    function updateDate() {
        let currentMonth = (new Date()).getMonth();
        let currentDayWeek = (new Date()).getDay();
        const currentTime = (new Date()).toLocaleTimeString();
        const currentMinute = (new Date()).getMinutes();
        let time_1;
        let time_2;
        if (currentMinute < 30) {
            time_1 = (new Date()).getHours() + ':' + '00'
            time_2 = (new Date()).getHours() + ':' + '30';
        } else if (currentMinute > 29) {
            time_1 = (new Date()).getHours() + ':' + '30';
            time_2 = (new Date()).getHours()+1 + ':' + '00'
        }
        for (let i = 0; i <= arrTextMonth.length; i++ ) {
            if (currentMonth === i) {
                currentMonth = arrTextMonth[i];
            }
        }
        for (let k = 0; k <= arrTextDay.length; k++ ) {
            if (currentDayWeek -1  === k) {
                currentDayWeek = arrTextDay[k];
            }
        }
        const currentDate = currentDayMonth + ' ' + currentMonth + ', ' + currentDayWeek;
        $('.date').text(currentDate);
        $('.time').text(currentTime);
        $('.time_1').text(time_1);
        $('.time_2').text(time_2);
        setTimeout(updateDate, 1000); 
    }

    function updateDayWeek() {
        for (let i = 0; i <= arrayDaysWeek.length; i++){
            if (dayWeek === 7) {
                if (i === dayWeek - 1) {
                    arrayDaysWeek[2] = 'СЕГОДНЯ'
                    arrayDaysWeek[3] = 'ЗАВТРА'
                }
            } else {
                if (i === dayWeek-1) {
                    arrayDaysWeek[i + 3] = 'СЕГОДНЯ'
                    arrayDaysWeek[i + 4] = 'ЗАВТРА'
                    let day = dayWeek + 3;
                }
            }
        }
        setTimeout(updateDayWeek, 60000);
        utils.applyTemplate(
            '.name-day-week', 
            'template/component/days_week.hbs',
            {
                arrayDaysWeek: arrayDaysWeek,
            }
        ) 

    }

    Handlebars.registerHelper('calculation-width', function(duration) {
        let widthBlockProgram =  Math.ceil((duration/(1800 / 361)));
        return widthBlockProgram;
      });

    Handlebars.registerHelper('formatting-time', function(start, duration) {
    let startTimeHour =  (new Date(start)).getHours();
    let startTimeMin =  (new Date(start)).getMinutes();
    let arrayMin = duration / 60;
    let endTimeMin = 0;
    let arrayHour = (String((arrayMin / 60).toFixed(2))).split('.');
    let endTimeHour = (new Date( start)).getHours() + parseInt(arrayHour[0]);
    if (arrayHour[1] !== "00") {
        endTimeMin =  (new Date(start)).getMinutes() + (arrayMin - arrayHour[0] * 60);
        if (endTimeMin >= 60) {
            endTimeHour = endTimeHour + 1;
            endTimeMin = endTimeMin - 60;
        }
    } else {
        endTimeMin =  (new Date(start)).getMinutes();
    }
    return startTimeHour + ':' + startTimeMin + '-' + endTimeHour + ':' + endTimeMin;
    });
});