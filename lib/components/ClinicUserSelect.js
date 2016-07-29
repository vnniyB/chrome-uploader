/*
* == BSD2 LICENSE ==
* Copyright (c) 2014, Tidepool Project
*
* This program is free software; you can redistribute it and/or modify it under
* the terms of the associated License, which is identical to the BSD 2-Clause
* License as published by the Open Source Initiative at opensource.org.
*
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the License for more details.
*
* You should have received a copy of the License along with this program; if
* not, you can obtain one from Tidepool Project at tidepool.org.
* == BSD2 LICENSE ==
*/

var _ = require('lodash');
var React = require('react');
var Select = require('react-select');
var sundial = require('sundial');
var cx = require('classnames');
var personUtils = require('../core/personUtils');

var styles = require('../../styles/components/ClinicUserSelect.module.less');
 
var ClinicUserSelect = React.createClass({
  propTypes: {
    allUsers: React.PropTypes.object.isRequired,
    onUserChange: React.PropTypes.func.isRequired,
    targetId: React.PropTypes.string,
    targetUsersForUpload: React.PropTypes.array.isRequired,
    onAddUserClick: React.PropTypes.func.isRequired,
    setTargetUser: React.PropTypes.func.isRequired
  },

  handleClickNext: function(e) {
    e.preventDefault();
    if(this.props.targetId){
      this.props.onUserChange(this.props.targetId);
    }
  },

  valueRenderer: function(option) {
    var user = _.get(this.props.allUsers, option.value);
    var name = personUtils.patientFullName(user);
    var bday = _.get(user, ['patient', 'birthday'], '');
    var mrn = _.get(user, ['patient', 'mrn'], '');

    var dateString = sundial.translateMask(bday, 'YYYY-MM-DD', 'M/D/YYYY');

    return (
      <div className={styles.optionLabelWrapper}>
        <div className={styles.optionLabelName}>
          {name} {mrn ? 'MRN:'+mrn : ''}
        </div>
        <div className={styles.optionLabelBirthday}>
          {dateString}
        </div>
      </div>
    );
  },

  renderSelector: function(){
    var allUsers = this.props.allUsers;
    var targets = this.props.targetUsersForUpload;
    var sorted = _.sortBy(targets, function(targetId) {
      return personUtils.patientFullName(allUsers[targetId]);
    });

    var selectorOpts = _.map(sorted, function(targetId) {
      var targetInfo = allUsers[targetId];
      var mrn = _.get(targetInfo, ['patient', 'mrn'], '');
      var bday = _.get(targetInfo, ['patient', 'birthday'], '');
      if(bday){
        bday = ' ' + sundial.translateMask(bday, 'YYYY-MM-DD', 'M/D/YYYY');
      }
      if (mrn) {
        mrn = ' ' + mrn;
      }
      var fullName = personUtils.patientFullName(targetInfo);
      return {value: targetId, label: fullName + mrn + bday};
    });

    return (
      <Select clearable={false}
        name={'uploadTargetSelect'}
        onChange={this.props.setTargetUser}
        options={selectorOpts}
        simpleValue={true}
        value={this.props.targetId}
        className={styles.Select}
        placeholder={'Search'}
        optionRenderer={this.valueRenderer}
        valueRenderer={this.valueRenderer} />
    );
  },

  renderButton: function() {
    var classes = cx({
      [styles.button]: true,
      disabled: !this.props.targetId
    });
    return (
      <div className={classes} disabled={!this.props.targetId} onClick={this.handleClickNext}>
        Next
      </div>
    );
  },

  renderAddNew: function() {
    var classes = cx({
      [styles.addLink]: true,
      [styles.valueSelected]: !!this.props.targetId
    });
    return (
      <div className={classes} onClick={this.props.onAddUserClick}>
        <i className={styles.addIcon}></i>
        Add new
      </div>
    );
  },

  render: function() {
    return (
      <div className={styles.wrap}>
        <div className={styles.wrapInner}>
          <div className={styles.headerWrap}>
            <div className={styles.header}>
              Who are you uploading for?
            </div>
            {this.renderAddNew()}
          </div>
          <div className={styles.clinicUserDropdown}>
            {this.renderSelector()}
          </div>
          <div className={styles.buttonRow}>
            {this.renderButton()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ClinicUserSelect;