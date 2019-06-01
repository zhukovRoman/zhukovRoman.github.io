(function($){
    jQuery.fn.touchFilter = function(method){
        var options = {
            name: 'Фильтр',
            add_switcher_text_on: 'Снять выделение',
            add_switcher_text_off: 'Выделить все',
            columns: 1,
            items: [['name1', 'Один'], ['name2', "Два"], ['name3', 'Три'], ['name4','dfadsf']]
        }
        var id = null;
        var $this = null

        var headerCheckboxEvent = function () {
            $('#'+id+" .tf-body input").prop('checked',
                $('#'+id+" .tf-header input").prop('checked'));
            changeAddSpanText();
            $this.trigger('tf.change');
        };

        var headerSpanClick = function () {
            $('#'+id+" .tf-header input").prop('checked',
                !$('#'+id+" .tf-header input").prop('checked') );
            headerCheckboxEvent();
        }

        var bodyCheckboxEvent = function () {
            allSelected = $('#'+id +' .tf-body input').length ==
            $('#'+id +' .tf-body input:checked').length
            $('#'+id +' .tf-header input').prop('checked',allSelected)
            //changeAddSpanText();
            $this.trigger('tf.change');
        };

        var changeAddSpanText = function () {
            if($('#'+id +' .tf-header input').prop('checked'))
                $('#'+id +' .tf-header span').text(options.add_switcher_text_on)
            else $('#'+id +' .tf-header span').text(options.add_switcher_text_off)
        }

        var bindEvents = function() {
            $('#'+id +' .tf-header input').on('change', headerCheckboxEvent)
            $('#'+id +' .tf-header span').on('click', headerSpanClick)
            $('#'+id +' .tf-body input').on('change', bodyCheckboxEvent)

        };

        var methods = {

            init: function () {
                $this = $(this)
                $this.addClass('touch-filter')
                id = $this.attr('id')
                var header = $(document.createElement('div')).addClass('tf-header')
                header.append($(document.createElement('input')).attr('id', 'select-all-' + id).attr('type', 'checkbox').prop("checked", true))
                header.append($(document.createElement('label')).attr('for', 'select-all-' + id).text(options.name))
                //header.append($(document.createElement('span')).addClass('additional-action').text(options.add_switcher_text_on))
                var filterBody = $(document.createElement('div')).addClass('tf-body')
                var itemWidth = 100 / options.columns + '%'
                var filterRow = $(document.createElement('div')).addClass('tf-row');
                console.log(options.items)
                for (var i = 0; i < options.items.length; i++) {
                    filterRow.append($(document.createElement('input')).attr('id', options.items[i][0])
                        .attr('type', 'checkbox')
                        .attr('data-value', options.items[i][0])
                        .prop("checked", true))
                    filterRow.append($(document.createElement('label')).attr('for', options.items[i][0]).text(options.items[i][1]).width(itemWidth))
                    if ((i + 1) % options.columns == 0 && i + 1 < options.items.length) {
                        filterBody.append(filterRow);
                        filterRow = $(document.createElement('div')).addClass('tf-row')
                    }
                }
                filterBody.append(filterRow);

                $this.append(header)
                $this.append(filterBody)

                bindEvents();

            },
            getValues: function(){
                var res=[];
                var id = $(this).attr('id')
                $.each($('#'+id +' .tf-body input:checked'), function(i,val){
                    res.push ($(val).attr('data-value'))
                })
                return res;
            }
        }

        // логика вызова метода
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            options = $.extend( options, arguments[0]);
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.touch-filter' );
        }

        return this.each(init);

    };
})(jQuery);
