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
 * @author suny1@mskcc.org on 3/30/16.
 *
 * retriving results in JSON from web APIs and converting/assemble to iViz format
 *
 */

'use strict';
(function (iViz, $) {
  
  iViz.data = {};
  
  iViz.data.init = function (_studyIdArr, _callbackFunc, _inputSampleList, _inputPatientList) {
    
    var _result = {};
    //var PORTAL_INST_URL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split('/')[1];
    var PORTAL_INST_URL = "http://localhost:8080/cbioportal";
    
    // ---- ajax cascade ----
    var _ajaxSampleMeta = [], _ajaxPatientMeta = [],
      _ajaxSampleData = [], _ajaxPatientData = [],
      _ajaxPatient2SampleIdMappingObj = {}, _ajaxSample2PatientIdMappingObj = {},
      _ajaxMutationCountData = {}, _ajaxCnaFractionData = {},
      _ajaxGeneticProfiles = {}, _ajaxCnaData = {}, _ajaxMutGenesData = {};
    
    // patient clinical attribute meta
    $.when.apply($, _studyIdArr.map(function (_studyId) {
      return $.ajax({
        method: "POST",
        url: PORTAL_INST_URL + '/api/clinicalattributes/patients',
        data: {study_id: _studyId}
      });
    })).done(function () {
      
      // add in study id as an attribute
      _ajaxPatientMeta.push({
        "datatype": "STRING",
        "description": "Cancer Types",
        "display_name": "Cancer Types",
        "attr_id": "study_id",
        "view_type": "pie_chart"
      });
      
      var _results = [];
      for (var i = 0; i < arguments.length; i++) {
        _results = _results.concat(arguments[i][0]);
      }
      _ajaxPatientMeta = _ajaxPatientMeta.concat(_.uniq(_results, 'attr_id'));
      
      // sample clinical attribute meta
      $.when.apply($, _studyIdArr.map(function (_studyId) {
        return $.ajax({
          method: "POST",
          url: PORTAL_INST_URL + '/api/clinicalattributes/samples',
          data: {study_id: _studyId}
        });
      })).done(function () {
        var _results = [];
        for (var i = 0; i < arguments.length; i++) {
          _results = _results.concat(arguments[i][0]);
        }
        _ajaxSampleMeta = _.uniq(_results, 'attr_id');
        
        // patient clinical data
        $.when.apply($, _studyIdArr.map(function (_studyId) {
          
          // Only store less than 32 attributes (due to limitation of crossfilter)
          // TODO: set priority for attributes
          _ajaxPatientMeta = _ajaxPatientMeta.splice(0, 31);
          
          return $.ajax({
            method: "POST",
            url: PORTAL_INST_URL + '/api/clinicaldata/patients',
            data: {study_id: _studyId, attribute_ids: _.pluck(_ajaxPatientMeta, 'attr_id').join(',')}
          });
        })).done(function () {
          var _results = [];
          for (var i = 0; i < arguments.length; i++) {
            _results = _results.concat(arguments[i][0]);
          }
          _ajaxPatientData = _results;
          
          // sample clinical data
          $.when.apply($, _studyIdArr.map(function (_studyId) {
            
            // Only store less than 32 attributes (due to limitation of crossfilter)
            // TODO: set priority for attributes
            _ajaxSampleMeta = _ajaxSampleMeta.splice(0, 31);
            return $.ajax({
              method: "POST",
              url: PORTAL_INST_URL + '/api/clinicaldata/samples',
              data: {study_id: _studyId, attribute_ids: _.pluck(_ajaxSampleMeta, 'attr_id').join(',')}
            });
          })).done(function () {
            var _results = [];
            for (var i = 0; i < arguments.length; i++) {
              _results = _results.concat(arguments[i][0]);
            }
            _ajaxSampleData = _results;
            
            // id mapping
            $.when.apply($, _studyIdArr.map(function (_studyId) {
              return $.ajax({
                method: "POST",
                url: PORTAL_INST_URL + '/webservice.do?',
                data: {cmd: 'getPatientSampleMapping', cancer_study_id: _studyId, case_set_id: _studyId + '_all'}
              });
            })).done(function () {
              for (var i = 0; i < arguments.length; i++) {
                _ajaxPatient2SampleIdMappingObj = $.extend({}, JSON.parse(arguments[i][0]), _ajaxPatient2SampleIdMappingObj);
              }
              
              // get all genetic profiles for queried studies
              $.when.apply($, _studyIdArr.map(function (_studyId) {
                
                return $.ajax({
                  method: "POST",
                  url: PORTAL_INST_URL + '/api/geneticprofiles',
                  data: {study_id: _studyId}
                });
              })).done(function () {
                var _results = [];
                for (var i = 0; i < arguments.length; i++) {
                  _results = _results.concat(arguments[i][0]);
                }
                _ajaxGeneticProfiles = _results;
                
                // mutation count
                var _mutCountStudyIdArr = _.filter(_studyIdArr, function (_studyId) {
                  return $.inArray(_studyId + '_mutations', _.pluck(_ajaxGeneticProfiles, 'id')) !== -1;
                });
                $.when.apply($, _mutCountStudyIdArr.map(function (_studyId) {
                  return $.ajax({
                    method: "POST",
                    url: PORTAL_INST_URL + '/mutations.json?',
                    data: {cmd: 'count_mutations', mutation_profile: _studyId + '_mutations'}
                  });
                })).done(function () {
                  for (var i = 0; i < arguments.length; i++) {
                    _ajaxMutationCountData = $.extend({}, arguments[i][0], _ajaxMutationCountData);
                  }
                  
                  // mutation data
                  var _mutDataStudyIdArr = _.filter(_studyIdArr, function (_studyId) {
                    return $.inArray(_studyId + '_mutations', _.pluck(_ajaxGeneticProfiles, 'id')) !== -1;
                  });
                  $.when.apply($, _mutDataStudyIdArr.map(function (_studyId) {
                    return $.ajax({
                      method: "POST",
                      url: PORTAL_INST_URL + '/mutations.json?',
                      data: {cmd: 'get_smg', mutation_profile: _studyId + '_mutations'}
                    });
                  })).done(function () {
                    for (var i = 0; i < arguments.length; i++) {
                      _results = _results.concat(arguments[i][0]);
                    }
                    _ajaxMutGenesData = _results;
                    
                    // cna fraction data
                    $.when.apply($, _studyIdArr.map(function (_studyId) {
                      return $.ajax({
                        method: "POST",
                        url: PORTAL_INST_URL + '/cna.json?',
                        data: {cmd: 'get_cna_fraction', cancer_study_id: _studyId}
                      });
                    })).done(function () {
                      for (var i = 0; i < arguments.length; i++) {
                        _ajaxCnaFractionData = $.extend({}, arguments[i][0], _ajaxCnaFractionData);
                      }
                      
                      // cna table data
                      var _gisticStudyIdArr = _.filter(_studyIdArr, function (_studyId) {
                        return $.inArray(_studyId + '_gistic', _.pluck(_ajaxGeneticProfiles, 'id')) !== -1;
                      });
                      $.when.apply($, _gisticStudyIdArr.map(function (_studyId) {
                        return $.ajax({
                          method: "POST",
                          url: PORTAL_INST_URL + '/cna.json?',
                          data: {cbio_genes_filter: true, cna_profile: _studyId + "_gistic"}
                        });
                      })).done(function () {
                        _ajaxCnaData.gene = [];
                        _ajaxCnaData.gistic = [];
                        _ajaxCnaData.cytoband = [];
                        _ajaxCnaData.alter = [];
                        _ajaxCnaData.caseIds = [];
                        for (var i = 0; i < arguments.length; i++) {
                          _ajaxCnaData.gene = _ajaxCnaData.gene.concat(arguments[i][0].gene);
                          _ajaxCnaData.gistic = _ajaxCnaData.gistic.concat(arguments[i][0].gistic);
                          _ajaxCnaData.cytoband = _ajaxCnaData.cytoband.concat(arguments[i][0].cytoband);
                          _ajaxCnaData.alter = _ajaxCnaData.alter.concat(arguments[i][0].alter);
                          _ajaxCnaData.caseIds = _ajaxCnaData.caseIds.concat(arguments[i][0].caseIds);
                        }
                        
                        // --- web API results converting ---- 
                        var _patientData = [], _sampleData = [];
                        var _patientIds = _.uniq(_.pluck(_ajaxPatientData, 'patient_id'));
                        var _sampleIds = _.uniq(_.pluck(_ajaxSampleData, 'sample_id'));
                        var _indexSample = 0, _sampleDataIndicesObj = {};
                        var _storedCnaGeneInventory = {}, _storedCnaGeneIndex = 0;
                        var _storedMutGeneInventory = {}, _storedMutGeneIndex = 0;
                        _.each(_sampleIds, function (_sampleId) {
                          var _datum = {};
                          _datum['sample_id'] = _sampleId;
                          _.each(_ajaxSampleData, function (_dataObj) {
                            if (_dataObj['sample_id'] === _sampleId) {
                              _datum[_dataObj['attr_id']] = _dataObj['attr_val'];
                              _datum['study_id'] = _dataObj['study_id'];
                            }
                          });
                          // map from sample to patient
                          _.each(Object.keys(_ajaxPatient2SampleIdMappingObj), function (_tmpPatientId) {
                            var _sampleIdArr = _ajaxPatient2SampleIdMappingObj[_tmpPatientId];
                            _.each(_sampleIdArr, function (_tmpSampleId) {
                              if (_tmpSampleId === _sampleId) {
                                _ajaxSample2PatientIdMappingObj[_sampleId] = _tmpPatientId;
                              }
                            });
                          });
                          // indices
                          _sampleDataIndicesObj[_sampleId] = _indexSample;
                          _indexSample += 1;
                          // mutation count
                          if (_ajaxMutationCountData[_sampleId] === undefined || _ajaxMutationCountData[_sampleId] === null) {
                            _datum['mutation_count'] = 0;
                          } else {
                            _datum['mutation_count'] = _ajaxMutationCountData[_sampleId];
                          }
                          // cna fraction
                          if (_ajaxCnaFractionData[_sampleId] === undefined || _ajaxCnaFractionData[_sampleId] === null) {
                            _datum['cna_fraction'] = 0;
                          } else {
                            _datum['cna_fraction'] = _ajaxCnaFractionData[_sampleId];
                          }
                          // mutation gene data
                          _datum['mutated_genes'] = [];
                          _.each(_ajaxMutGenesData, function (_mutGeneDataObj) {
                            _.each(_mutGeneDataObj.caseIds, function (_caseId) {
                              if (_caseId === _sampleId) {
                                if (_storedMutGeneInventory.hasOwnProperty(_mutGeneDataObj.gene_symbol)) { // if gene is already stored in the inventory
                                  _datum['mutated_genes'].push(_storedMutGeneInventory[_mutGeneDataObj.gene_symbol].index);
                                } else {
                                  _storedMutGeneInventory[_mutGeneDataObj.gene_symbol] = {};
                                  _storedMutGeneInventory[_mutGeneDataObj.gene_symbol].gene_symbol = _mutGeneDataObj.gene_symbol;
                                  _storedMutGeneInventory[_mutGeneDataObj.gene_symbol].num_mut = _mutGeneDataObj.num_muts;
                                  if (_mutGeneDataObj.hasOwnProperty('qval')) {
                                    _storedMutGeneInventory[_mutGeneDataObj.gene_symbol].q_val = _mutGeneDataObj.q_val;
                                  } else {
                                    _storedMutGeneInventory[_mutGeneDataObj.gene_symbol].q_val = null;
                                  }
                                  _storedMutGeneInventory[_mutGeneDataObj.gene_symbol].index = _storedMutGeneIndex;
                                  _datum['mutated_genes'].push(_storedMutGeneIndex);
                                  _storedMutGeneIndex += 1;
                                }
                              }
                            });
                          });
                          // cna data
                          _datum['cna_details'] = [];
                          $.each(_ajaxCnaData.caseIds, function (_index, _caseIdsPerGene) {
                            _.each(_caseIdsPerGene, function (_caseId) {
                              if (_sampleId === _caseId) {
                                if (_storedCnaGeneInventory.hasOwnProperty(_ajaxCnaData.gene[_index])) { // if gene is already stored in the inventory
                                  _datum['cna_details'].push(_storedCnaGeneInventory[_ajaxCnaData.gene[_index]].index);
                                } else { // create a new gene entry
                                  _storedCnaGeneInventory[_ajaxCnaData.gene[_index]] = {};
                                  _storedCnaGeneInventory[_ajaxCnaData.gene[_index]].gene_symbol = _ajaxCnaData.gene[_index];
                                  _storedCnaGeneInventory[_ajaxCnaData.gene[_index]].cna = _ajaxCnaData.alter[_index];
                                  _storedCnaGeneInventory[_ajaxCnaData.gene[_index]].cytoband = _ajaxCnaData.cytoband[_index];
                                  if (_ajaxCnaData.gistic[_index] === null) {
                                    _storedCnaGeneInventory[_ajaxCnaData.gene[_index]].gistic = null;
                                  } else {
                                    _storedCnaGeneInventory[_ajaxCnaData.gene[_index]].gistic = _ajaxCnaData.gistic[_index][0];
                                  }
                                  _storedCnaGeneInventory[_ajaxCnaData.gene[_index]].index = _storedCnaGeneIndex;
                                  _datum['cna_details'].push(_storedCnaGeneIndex);
                                  _storedCnaGeneIndex += 1;
                                }
                              }
                            });
                          });
                          // final push
                          _sampleData.push(_datum);
                        });
                        
                        // construct attr meta for cna details
                        if (_gisticStudyIdArr.length !== 0) {
                          var _cnaAttrMeta = {};
                          _cnaAttrMeta.type = 'TABLE';
                          _cnaAttrMeta.view_type = 'table';
                          _cnaAttrMeta.display_name = 'Copy Number Alterations';
                          _cnaAttrMeta.description = 'Copy Number Alterations';
                          _cnaAttrMeta.gene_list = _storedCnaGeneInventory;
                          _ajaxSampleMeta.push(_cnaAttrMeta);
                        }
                        
                        // construct attr meta for gene mutation info
                        if (_mutDataStudyIdArr.length !== 0) {
                          var _mutDataAttrMeta = {};
                          _mutDataAttrMeta.type = 'TABLE';
                          _mutDataAttrMeta.view_type = 'table';
                          _mutDataAttrMeta.display_name = 'Mutated Genes';
                          _mutDataAttrMeta.description = 'Mutated Genes';
                          _mutDataAttrMeta.gene_list = _storedMutGeneInventory;
                          _ajaxSampleMeta.push(_mutDataAttrMeta);
                        }
                        
                        var _indexPatient = 0, _patientDataIndicesObj = {};
                        _.each(_patientIds, function (_patientId) {
                          var _datum = {};
                          _datum['patient_id'] = _patientId;
                          _.each(_ajaxPatientData, function (_dataObj) {
                            if (_dataObj['patient_id'] === _patientId) {
                              _datum[_dataObj['attr_id']] = _dataObj['attr_val'];
                              _datum['study_id'] = _dataObj['study_id'];
                            }
                          });
                          _patientDataIndicesObj[_patientId] = _indexPatient;
                          _indexPatient += 1;
                          _patientData.push(_datum);
                        });
                        
                        // define view type from data type
                        _.each(_ajaxSampleMeta, function (_metaObj) {
                          if (_metaObj.datatype === "NUMBER") {
                            _metaObj.view_type = 'bar_chart';
                          } else if (_metaObj.datatype === "STRING") {
                            _metaObj.view_type = 'pie_chart';
                          }
                        });
                        _.each(_ajaxPatientMeta, function (_metaObj) {
                          if (_metaObj.datatype === "NUMBER") {
                            _metaObj.view_type = 'bar_chart';
                          } else if (_metaObj.datatype === "STRING") {
                            _metaObj.view_type = 'pie_chart';
                          }
                        });
                        
                        _result.groups = {};
                        _result.groups.patient = {};
                        _result.groups.sample = {};
                        _result.groups.group_mapping = {};
                        _result.groups.patient.attr_meta = _ajaxPatientMeta;
                        _result.groups.sample.attr_meta = _ajaxSampleMeta;
                        _result.groups.patient.data = _patientData;
                        _result.groups.sample.data = _sampleData;
                        _result.groups.patient.data_indices = {};
                        _result.groups.sample.data_indices = {};
                        _result.groups.patient.data_indices.patient_id = _patientDataIndicesObj;
                        _result.groups.sample.data_indices.sample_id = _sampleDataIndicesObj;
                        _result.groups.group_mapping.sample = {};
                        _result.groups.group_mapping.patient = {};
                        _result.groups.group_mapping.sample.patient = _ajaxSample2PatientIdMappingObj;
                        _result.groups.group_mapping.patient.sample = _ajaxPatient2SampleIdMappingObj;
                        
                        _callbackFunc(_result, _inputSampleList, _inputPatientList);
                        
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    
  }
}(window.iViz, window.$));