/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an 'as is' basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of cBioPortal.
 *
 * cBioPortal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Created by Karthik Kalletla on 4/6/16.
 */
'use strict';
(function(Vue, dc, iViz, $) {
  var settings_ = {
    pieChart: {
      width: 150,
      height: 150,
      innerRadius: 15
    },
    barChart: {
      width: 400,
      height: 180
    },
    transitionDuration: iViz.opts.dc.transitionDuration
  };
  Vue.component('abstractChart', {
    template: ' <div is="chart-implementation"' +
    ' :ndx="ndx" :data="data"    :filters.sync="filters"  :attributes="attribute" v-for="attribute in attributes"></div>',
    props: [
      'data', 'attributes', 'filters', 'type', 'mappedsamples',
      'mappedpatients'
    ], created: function() {
      var ndx_ = crossfilter(this.data);
      var invisibleBridgeChart_ = iViz.bridgeChart.init(ndx_, settings_,
        this.type);
      this.ndx = ndx_;
      this.chartInvisible = invisibleBridgeChart_;
    },
    data: function() {
      return {
        syncPatient: true,
        syncSample: true
      }
    },
    watch: {
      'mappedsamples': function(val) {
        if (this.syncSample) {
          if (this.type === 'sample') {
            this.updateInvisibleChart(val)
          }
        } else {
          this.syncSample = true;
        }
      },
      'mappedpatients': function(val) {
        if (this.syncPatient) {
          if (this.type === 'patient') {
            this.updateInvisibleChart(val)
          }
        } else {
          this.syncPatient = true;
        }
      }
    },
    events: {
      'update-filters': function() {
        this.syncPatient = false;
        this.syncSample = false;
        this.$dispatch('update-all-filters')
      }
    },
    methods: {
      updateInvisibleChart: function(val) {
        this.chartInvisible.filter(null);
        this.chartInvisible.filter([val]);
        dc.redrawAll()
      }
    }
  });
})(window.Vue, window.dc, window.iViz,
  window.$ || window.jQuery);
