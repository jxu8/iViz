var left_panel = (function() {

  var attrs = {
    GENDER: [
      {
        NAME: "FEMALE",
        VALUE: "female"
      },
      {
        NAME: "NA",
        VALUE: "na",
      }
    ],
    OS_STATUS: [
      {
        NAME: "DECEASED",
        VALUE: "deceased",
      },
      {
        NAME: "LIVING",
        VALUE: "living"
      },
      {
        NAME: "NA",
        VALUE: "na"
      }
    ],
    MOLECULAR_SUBTYPE: [
      {
        NAME: "Copy-number high (Serous-like)",
        VALUE: "copy_num_high"
      },
      {
        NAME: "Copy-number low (Endometriod)",
        VALUE: "copy_num_low"
      },
      {
        NAME: "MSI (Hyper-mutated)",
        VALUE: "msi"
      },
      {
        NAME: "NA",
        VALUE: "na"
      },
      {
        NAME: "POLE (Ultra-mutated)",
        VALUE: "pole"
      }
    ],
    RACE: [
      {
        NAME: "AMERICAN INDIAN OR ALASKA NATIVE",
        VALUE: "american_indian"
      },
      {
        NAME: "ASIAN",
        VALUE: "asian"
      },
      {
        NAME: "BLACK OR AFRICAN AMERICAN",
        VALUE: "black"
      },
      {
        NAME: "NA",
        VALUE: "na"
      },
      {
        NAME: "NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER",
        VALUE: "native_american"
      },
      {
        NAME: "WHITE",
        VALUE: "white"
      }
    ],
    STUDY_ID: [
      {
        NAME: "Uterus TCGA",
        VALUE: "ucec_tcga"
      },
      {
        NAME: "MSKCC Impact",
        VALUE: "msk_impact"
      }
    ]
};

return {
  init: function(){
    //$("#left_panel").append("<span><button onclick='left_panel.set_status()'></button></span>");
    $.each(Object.keys(attrs), function(_index, _key) {
      var _attr = attrs[_key];
      $("#left_panel").append("<h5>" + _key + "</h5>");
      $.each(_attr, function(_inner_index, _obj) {
        $("#left_panel").append("<input type='checkbox' id='" + _key + "_" +_obj.VALUE + "' name='" + _key + "' value='" + _obj.VALUE + "'>" + _obj.NAME + "<br>");
      });
    });
    $("#left_panel input[type=checkbox]").click(function() {
           left_panel.update_right_panel();
     });
  },
  update_right_panel: function() {
    var _result = {};
    $.each(Object.keys(attrs), function(_index, _key) {
      _result[_key] = [];
      _result[_key].length = 0;
    });
    $('#left_panel input[type=checkbox]').each(function () {
           if (this.checked) {
              var selected_val = $(this).val();
              var selected_attr_name = $(this)[0].name;
              $.each(attrs[selected_attr_name], function(_index, _obj) {
                  if (_obj.VALUE === selected_val) {
                    _result[selected_attr_name].push(_obj.NAME);
                  }
              });
           }
    });
    //TODO
    //update view -- trigger event listener
    StudyViewInitCharts.filterChartFromLeftPanel(_result);
  },
  set_status: function(_input) {
    var pseudo_input = _input;
    $('#left_panel input[type=checkbox]').prop('checked', false);

    $.each(Object.keys(pseudo_input), function(_index, _selected_attr_category) {
      var _obj = pseudo_input[_selected_attr_category];
      $.each(_obj, function(_inner_index, _selected_attr_val) {

        //find the value maps to the display name
        var _defined_selected_attr_val = "";
        $.each(Object.keys(attrs), function(_tmp_index, _tmp_key) {
          var _tmp_obj = attrs[_tmp_key];
          $.each(_tmp_obj, function(_tmp_tmp_index, _tmp_obj) {
            if (_tmp_obj.NAME === _selected_attr_val)
              _defined_selected_attr_val = _tmp_obj.VALUE;
          });
        });

        $('#left_panel input[type=checkbox]').each(function() {
          var _this_checkbox_id = $(this).attr("id");
          if (_this_checkbox_id === _selected_attr_category + "_" + _defined_selected_attr_val) {
            $("#" + _this_checkbox_id).prop("checked", true);
          }
        });
      });
    });

  }
}

}());

