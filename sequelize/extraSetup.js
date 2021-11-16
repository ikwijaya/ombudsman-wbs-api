function applyExtraSetup(sq) {
  const {
    forms, roles, users, usertypes, userregion, sessions,
    cities, regions, violations, work_units, options, legal_standing, dispositions, status,
    // complaints
    complaints,
    complaint_verifications,
    complaint_violations,
    complaint_attachments,
    complaint_events,
    complaint_reported,
    complaint_incidents,
    complaint_studies, complaint_study_events, complaint_study_incidents, complaint_study_reported, complaint_study_violations, complaint_study_attachments,
    complaint_decisions,
    complaint_decision_attachments,
    complaint_determinations, complaint_determination_users,
    complaint_actions,
    complaint_rejected_types,
    complaint_pleno,
    validation, validation_comm, validation_checklists,
    monitoring, monitoring_detail,
    closing,
    request, request_attachment,
    clarification, clarification_detail,
    confirmation,
    study_lys, study_lys_violation, study_lys_event,
    lhpa, lhpa_events, lhpa_actions, lhpa_act_detail,
    surgery, surgery_user,
    delivery, letters, clogs, formtypes
  } = sq.models;

  // form -> type (grouping roles)
  formtypes.belongsTo(forms, {
    foreignKey: {
      name: 'idx_m_form',
      allowNull: false
    }
  });
  formtypes.belongsTo(usertypes, {
    foreignKey: {
      name: 'idx_m_user_type',
      allowNull: false
    }
  });
  forms.hasMany(formtypes, {
    foreignKey: {
      name: 'idx_m_form',
      allowNull: false
    }
  });
  usertypes.hasMany(formtypes, {
    foreignKey: {
      name: 'idx_m_user_type',
      allowNull: false
    }
  })

  // security relations
  forms.hasMany(roles, {
    foreignKey: {
      name: 'idx_m_form',
      allowNull: false
    }
  });    // done
  roles.belongsTo(forms, {
    foreignKey: {
      name: 'idx_m_form',
      allowNull: false
    }
  });  // done 
  users.hasMany(roles, {
    foreignKey: {
      name: 'idx_m_user',
      allowNull: false
    }
  });
  users.hasMany(userregion, {
    foreignKey: {
      name: 'idx_m_user',
      allowNull: false
    }
  })
  userregion.belongsTo(users, {
    foreignKey: {
      name: 'idx_m_user',
      allowNull: false
    }
  })
  roles.belongsTo(users, {
    foreignKey: {
      name: 'idx_m_user',
      allowNull: false
    }
  });
  users.hasMany(sessions, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
  sessions.belongsTo(users, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
  usertypes.hasMany(users, {
    foreignKey: {
      name: 'idx_m_user_type',
      allowNull: false
    }
  });
  users.belongsTo(usertypes, {
    foreignKey: {
      name: 'idx_m_user_type',
      allowNull: false
    }
  });

  //complaint
  clogs.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasMany(clogs, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasMany(complaint_pleno, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_pleno.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasMany(complaint_events, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasMany(complaint_incidents, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasMany(complaint_reported, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasMany(complaint_attachments, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasOne(complaint_verifications, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasOne(complaint_studies, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasOne(complaint_decisions, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasOne(complaint_determinations, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  legal_standing.hasMany(complaints, {
    foreignKey: {
      name: 'idx_m_legal_standing'
    }
  })
  status.hasMany(complaints, {
    foreignKey: {
      name: 'idx_m_status',
      allowNull: false
    }
  })
  complaints.hasMany(complaint_violations, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  violations.hasMany(complaint_violations, {
    foreignKey: {
      name: 'idx_m_violation',
      allowNull: false
    }
  })
  cities.hasMany(complaint_incidents, {
    foreignKey: {
      name: 'idx_m_city'
    }
  })
  work_units.hasMany(complaint_incidents, {
    foreignKey: {
      name: 'idx_m_work_unit'
    }
  })
  regions.hasMany(cities, {
    foreignKey: {
      name: 'idx_m_region',
      allowNull: false
    }
  })
  complaint_rejected_types.hasMany(complaint_verifications, {
    foreignKey: {
      name: 'idx_m_complaint_rejected_type',
    }
  })
  complaint_studies.hasMany(complaint_study_events, {
    foreignKey: {
      name: 'idx_t_complaint_study'
    }
  })
  complaint_studies.hasMany(complaint_study_reported, {
    foreignKey: {
      name: 'idx_t_complaint_study'
    }
  })
  complaint_studies.hasMany(complaint_study_incidents, {
    foreignKey: {
      name: 'idx_t_complaint_study'
    }
  })
  complaint_studies.hasMany(complaint_study_attachments, {
    foreignKey: {
      name: 'idx_t_complaint_study',
      allowNull: false
    }
  })
  work_units.hasMany(complaint_study_incidents, {
    foreignKey: {
      name: 'idx_m_work_unit'
    }
  })
  work_units.hasMany(complaint_study_reported, {
    foreignKey: {
      name: 'idx_m_work_unit'
    }
  })
  cities.hasMany(complaint_study_incidents, {
    foreignKey: {
      name: 'idx_m_city'
    }
  })
  complaint_studies.hasMany(complaint_study_violations, {
    foreignKey: {
      name: 'idx_t_complaint_study',
      allowNull: false
    }
  })
  violations.hasMany(complaint_study_violations, {
    foreignKey: {
      name: 'idx_m_violation',
      allowNull: false
    }
  })
  dispositions.hasMany(complaint_studies, {
    foreignKey: {
      name: 'idx_m_disposition'
    }
  })
  dispositions.hasMany(complaint_decisions, {
    foreignKey: {
      name: 'idx_m_disposition'
    }
  })
  violations.hasMany(complaint_decisions, {
    foreignKey: {
      name: 'idx_m_violation',
      allowNull: false
    }
  })
  complaint_determinations.hasMany(complaint_determination_users, {
    foreignKey: {
      name: 'idx_t_complaint_determination'
    }
  })
  users.hasMany(complaint_determination_users, {
    foreignKey: {
      name: 'idx_m_user'
    }
  })
  complaints.hasMany(complaint_actions, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_decisions.hasMany(complaint_decision_attachments, {
    foreignKey: {
      name: 'idx_t_complaint_decision',
      allowNull: false
    }
  })
  complaints.hasOne(validation, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  validation.hasMany(validation_checklists, {
    foreignKey: {
      name: 'idx_t_validation',
      allowNull: false,
    }
  })
  validation.hasMany(validation_comm, {
    foreignKey: {
      name: 'idx_t_validation',
      allowNull: false
    }
  })
  complaints.hasOne(monitoring, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  monitoring.hasMany(monitoring_detail, {
    foreignKey: {
      name: 'idx_t_monitoring',
      allowNull: false
    }
  })
  complaints.hasOne(closing, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasOne(request, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  request.hasMany(request_attachment, {
    foreignKey: {
      name: 'idx_t_request',
      allowNull: false
    }
  })
  complaints.hasOne(clarification, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  clarification.hasMany(clarification_detail, {
    foreignKey: {
      name: 'idx_t_clarification',
      allowNull: false
    }
  })
  // changes hasOne -> hasMany
  complaints.hasMany(confirmation, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.hasOne(study_lys, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  study_lys.hasMany(study_lys_violation, {
    foreignKey: {
      name: 'idx_t_study_lys',
      allowNull: false
    }
  })
  violations.hasMany(study_lys_violation, {
    foreignKey: {
      name: 'idx_m_violation',
      allowNull: false
    }
  })
  study_lys.hasMany(study_lys_event, {
    foreignKey: {
      name: 'idx_t_study_lys',
      allowNull: false
    }
  })
  legal_standing.hasMany(study_lys, {
    foreignKey: {
      name: 'idx_m_legal_standing'
    }
  })
  // hasOne => hasMany
  complaints.hasMany(lhpa, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  lhpa.hasMany(lhpa_events, {
    foreignKey: {
      name: 'idx_t_lhpa',
      allowNull: false
    }
  })
  lhpa.hasMany(lhpa_actions, {
    foreignKey: {
      name: 'idx_t_lhpa',
      allowNull: false
    }
  })
  lhpa_actions.hasMany(lhpa_act_detail, {
    foreignKey: {
      name: 'idx_t_lhpa_action',
      allowNull: false
    }
  })
  complaints.hasOne(surgery, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  surgery.hasMany(surgery_user, {
    foreignKey: {
      name: 'idx_t_surgery',
      allowNull: false
    }
  })
  users.hasMany(surgery_user, {
    foreignKey: {
      name: 'idx_m_user',
      allowNull: false
    }
  })
  complaints.hasOne(delivery, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })

  // belongsTo
  complaint_events.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_incidents.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_reported.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_attachments.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_verifications.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_studies.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_decisions.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_determinations.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaints.belongsTo(legal_standing, {
    foreignKey: {
      name: 'idx_m_legal_standing'
    }
  })
  complaints.belongsTo(status, {
    foreignKey: {
      name: 'idx_m_status',
      allowNull: false
    }
  })
  complaint_violations.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_violations.belongsTo(violations, {
    foreignKey: {
      name: 'idx_m_violation',
      allowNull: false
    }
  })
  complaint_incidents.belongsTo(cities, {
    foreignKey: {
      name: 'idx_m_city'
    }
  })
  complaint_incidents.belongsTo(work_units, {
    foreignKey: {
      name: 'idx_m_work_unit'
    }
  })
  cities.belongsTo(regions, {
    foreignKey: {
      name: 'idx_m_region',
      allowNull: false
    }
  })
  complaint_verifications.belongsTo(complaint_rejected_types, {
    foreignKey: {
      name: 'idx_m_complaint_rejected_type',
    }
  })
  complaint_study_events.belongsTo(complaint_studies, {
    foreignKey: {
      name: 'idx_t_complaint_study'
    }
  })
  complaint_study_reported.belongsTo(complaint_studies, {
    foreignKey: {
      name: 'idx_t_complaint_study'
    }
  })
  complaint_study_reported.belongsTo(work_units, {
    foreignKey: {
      name: 'idx_m_work_unit'
    }
  })
  complaint_study_incidents.belongsTo(complaint_studies, {
    foreignKey: {
      name: 'idx_t_complaint_study'
    }
  })
  complaint_study_attachments.belongsTo(complaint_studies, {
    foreignKey: {
      name: 'idx_t_complaint_study',
      allowNull: false
    }
  })
  complaint_study_incidents.belongsTo(work_units, {
    foreignKey: {
      name: 'idx_m_work_unit'
    }
  })
  complaint_study_incidents.belongsTo(cities, {
    foreignKey: {
      name: 'idx_m_city'
    }
  })
  complaint_study_violations.belongsTo(complaint_studies, {
    foreignKey: {
      name: 'idx_t_complaint_study',
      allowNull: false
    }
  })
  complaint_study_violations.belongsTo(violations, {
    foreignKey: {
      name: 'idx_m_violation'
    }
  })
  complaint_studies.belongsTo(dispositions, {
    foreignKey: {
      name: 'idx_m_disposition'
    }
  })
  complaint_decisions.belongsTo(dispositions, {
    foreignKey: {
      name: 'idx_m_disposition'
    }
  })
  complaint_decisions.belongsTo(violations, {
    foreignKey: {
      name: 'idx_m_violation'
    }
  })
  complaint_determination_users.belongsTo(complaint_determinations, {
    foreignKey: {
      name: 'idx_t_complaint_determination'
    }
  })
  complaint_determination_users.belongsTo(users, {
    foreignKey: {
      name: 'idx_m_user'
    }
  })
  complaint_actions.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  complaint_decision_attachments.belongsTo(complaint_decisions, {
    foreignKey: {
      name: 'idx_t_complaint_decision',
      allowNull: false
    }
  })
  validation.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  validation_checklists.belongsTo(validation, {
    foreignKey: {
      name: 'idx_t_validation',
      allowNull: false
    }
  })
  validation_comm.belongsTo(validation, {
    foreignKey: {
      name: 'idx_t_validation',
      allowNull: false
    }
  })
  monitoring.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  monitoring_detail.belongsTo(monitoring, {
    foreignKey: {
      name: 'idx_t_monitoring',
      allowNull: false
    }
  })
  closing.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  request.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  request_attachment.belongsTo(request, {
    foreignKey: {
      name: 'idx_t_request',
      allowNull: false
    }
  })
  clarification.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  clarification_detail.belongsTo(clarification, {
    foreignKey: {
      name: 'idx_t_clarification',
      allowNull: false
    }
  })
  confirmation.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  study_lys.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  study_lys_event.belongsTo(study_lys, {
    foreignKey: {
      name: 'idx_t_study_lys',
      allowNull: false
    }
  })
  study_lys_violation.belongsTo(study_lys, {
    foreignKey: {
      name: 'idx_t_study_lys',
      allowNull: false
    }
  })
  study_lys_violation.belongsTo(violations, {
    foreignKey: {
      name: 'idx_m_violation',
      allowNull: false
    }
  })
  study_lys.belongsTo(legal_standing, {
    foreignKey: {
      name: 'idx_m_legal_standing'
    }
  })
  lhpa.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  lhpa_events.belongsTo(lhpa, {
    foreignKey: {
      name: 'idx_t_lhpa',
      allowNull: false
    }
  })
  lhpa_actions.belongsTo(lhpa, {
    foreignKey: {
      name: 'idx_t_lhpa',
      allowNull: false
    }
  })
  lhpa_act_detail.belongsTo(lhpa_actions, {
    foreignKey: {
      name: 'idx_t_lhpa_action',
      allowNull: false
    }
  })
  surgery.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
  surgery_user.belongsTo(surgery, {
    foreignKey: {
      name: 'idx_t_surgery',
      allowNull: false
    }
  })
  surgery_user.belongsTo(users, {
    foreignKey: {
      name: 'idx_m_user',
      allowNull: false
    }
  })
  delivery.belongsTo(complaints, {
    foreignKey: {
      name: 'idx_m_complaint',
      allowNull: false
    }
  })
}

module.exports = { applyExtraSetup };