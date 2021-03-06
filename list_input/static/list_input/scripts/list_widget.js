function get_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

var MakeList = function(parent, name, target, separator, minimum, maximum) {
    var div = $('<div>', {"class": 'listinput'});
    parent.append(div);

    var self = {
        inputs: {},
        minimum: minimum,
        maximum: maximum,
        update: function() {
            $.each(self.inputs, function(index, input) {
                var input_value = input.get_value();
                if (input_value.length < 1) {
                    input.remove();
                }
            });
            self.add();
            var list = self.get_list();
            var json = JSON.stringify(list);
            target.val(json);
        },
        add: function(value) {
            if (self.maximum > 0) {
                if (self.get_list().length === self.maximum) {
                    return
                }
            }
            var value = value || "";
            var guid = get_guid();
            var new_input = ListInput(div);
            new_input.val(value);
            new_input.guid = guid;
            self.inputs[guid] = new_input;
            new_input.list = self;
            new_input.input.focus();
            return new_input;
        },
        get_list: function() {
            var values = [];
            $.each(self.inputs, function(index, input) {
                value = input.input.val();
                if ((input.input.val().length > 0) && ($.inArray(value, values))) {
                    values.push(value);
                }
            });
            if (values.length < 1) {
                return [''];

            } else {
                return values;
            }
        }
    };
    self.add();
    var initial_json = target.val();
    if (initial_json !== "") {
        var initial_list = JSON.parse(target.val());
        if (initial_list.length > 0) {
            for (var i=0; i<initial_list.length; i++) {
                var input = div.find('.list_input_input:last');
                input.val(initial_list[i]);
                self.add();
            }
        }
    }
    self.update();
    return self;
};

var ListInput = function(parent) {
    var div = $('<div class="list_input InputAddOn"></div>');
    var input = $('<input type="text" class="list_input_input InputAddOn-field">');
    parent.append(div);
    div.append(input);
    var remove_button = $('<button class="remove InputAddOn-item">&#x274C;</button>');
    div.append(remove_button);
    var self = {
        div: div,
        input: input,
        remove_button: remove_button,
        get_value: function(){
            return self.input.val();
        }
    };

    self.val = function(value) {
        self.input.val(value);
    }

    remove_button.click(function() {
        self.remove();
        self.list.update();
    });

    self.remove = function(){
        self.div.detach();
        self.div.css('background', 'red');
        input.remove();
        remove_button.remove();
        delete self.list.inputs[self.guid];
    };

    input.change(function() {
        if (input.val().length > 0) {
            self.list.update();
        }
    });
    return self;
};
