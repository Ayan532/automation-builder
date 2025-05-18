export const SAMPLE_APPS = {
  core: {
    id: 'core',
    name: 'Core',
    icon: '⚙️',
    color: 'bg-gray-100',
    actions: {
      condition: {
        key: 'condition',
        label: 'Condition',
        description: 'Add conditional branching logic to your workflow',
        appId: 'core',
        config: {
          fields: [
            {
              key: 'condition',
              label: 'Condition Name',
              type: 'text',
              placeholder: 'Enter a name for this condition',
              required: true
            }
          ]
        }
      }
    }
  },
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    color: 'bg-red-100',
    triggers: {
      newEmail: {
        key: 'newEmail',
        label: 'New Email',
        description: 'Triggers when a new email is received',
        appId: 'gmail',
        config: {
          fields: [
            {
              key: 'fromEmail',
              label: 'From Email',
              type: 'text',
              placeholder: 'email@example.com',
              required: false
            },
            {
              key: 'subject',
              label: 'Subject Contains',
              type: 'text',
              placeholder: 'invoice',
              required: false
            },
            {
              key: 'hasAttachment',
              label: 'Has Attachment',
              type: 'checkbox',
              required: false
            }
          ]
        }
      },
      emailSent: {
        key: 'emailSent',
        label: 'Email Sent',
        description: 'Triggers when you send an email',
        appId: 'gmail',
        config: {
          fields: [
            {
              key: 'toEmail',
              label: 'To Email',
              type: 'text',
              placeholder: 'email@example.com',
              required: false
            }
          ]
        }
      }
    },
    actions: {
      sendEmail: {
        key: 'sendEmail',
        label: 'Send Email',
        description: 'Sends an email',
        appId: 'gmail',
        config: {
          fields: [
            {
              key: 'to',
              label: 'To',
              type: 'text',
              placeholder: 'recipient@example.com',
              required: true
            },
            {
              key: 'subject',
              label: 'Subject',
              type: 'text',
              placeholder: 'Email Subject',
              required: true
            },
            {
              key: 'body',
              label: 'Body',
              type: 'textarea',
              placeholder: 'Email content...',
              required: true
            }
          ]
        }
      },
      addLabel: {
        key: 'addLabel',
        label: 'Add Label',
        description: 'Adds a label to an email',
        appId: 'gmail',
        config: {
          fields: [
            {
              key: 'emailId',
              label: 'Email ID',
              type: 'text',
              required: true
            },
            {
              key: 'labelName',
              label: 'Label Name',
              type: 'text',
              placeholder: 'Important',
              required: true
            }
          ]
        }
      }
    }
  },
  sheets: {
    id: 'sheets',
    name: 'Google Sheets',
    icon: '📊',
    color: 'bg-green-100',
    triggers: {
      newRow: {
        key: 'newRow',
        label: 'New Row',
        description: 'Triggers when a new row is added to a sheet',
        appId: 'sheets',
        config: {
          fields: [
            {
              key: 'spreadsheetId',
              label: 'Spreadsheet ID',
              type: 'text',
              required: true
            },
            {
              key: 'sheetName',
              label: 'Sheet Name',
              type: 'text',
              placeholder: 'Sheet1',
              required: true
            }
          ]
        }
      },
      updatedRow: {
        key: 'updatedRow',
        label: 'Updated Row',
        description: 'Triggers when a row is updated in a sheet',
        appId: 'sheets',
        config: {
          fields: [
            {
              key: 'spreadsheetId',
              label: 'Spreadsheet ID',
              type: 'text',
              required: true
            },
            {
              key: 'sheetName',
              label: 'Sheet Name',
              type: 'text',
              placeholder: 'Sheet1',
              required: true
            }
          ]
        }
      }
    },
    actions: {
      addRow: {
        key: 'addRow',
        label: 'Add Row',
        description: 'Adds a row to a sheet',
        appId: 'sheets',
        config: {
          fields: [
            {
              key: 'spreadsheetId',
              label: 'Spreadsheet ID',
              type: 'text',
              required: true
            },
            {
              key: 'sheetName',
              label: 'Sheet Name',
              type: 'text',
              placeholder: 'Sheet1',
              required: true
            },
            {
              key: 'values',
              label: 'Values (comma separated)',
              type: 'text',
              placeholder: 'value1, value2, value3',
              required: true
            }
          ]
        }
      },
      updateRow: {
        key: 'updateRow',
        label: 'Update Row',
        description: 'Updates a row in a sheet',
        appId: 'sheets',
        config: {
          fields: [
            {
              key: 'spreadsheetId',
              label: 'Spreadsheet ID',
              type: 'text',
              required: true
            },
            {
              key: 'sheetName',
              label: 'Sheet Name',
              type: 'text',
              placeholder: 'Sheet1',
              required: true
            },
            {
              key: 'rowIndex',
              label: 'Row Index',
              type: 'text',
              placeholder: '2',
              required: true
            },
            {
              key: 'values',
              label: 'Values (comma separated)',
              type: 'text',
              placeholder: 'value1, value2, value3',
              required: true
            }
          ]
        }
      }
    }
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    color: 'bg-purple-100',
    triggers: {
      newMessage: {
        key: 'newMessage',
        label: 'New Message',
        description: 'Triggers when a new message is posted to a channel',
        appId: 'slack',
        config: {
          fields: [
            {
              key: 'channelName',
              label: 'Channel Name',
              type: 'text',
              placeholder: '#general',
              required: true
            },
            {
              key: 'containsText',
              label: 'Contains Text',
              type: 'text',
              placeholder: 'important',
              required: false
            }
          ]
        }
      },
      newFile: {
        key: 'newFile',
        label: 'New File',
        description: 'Triggers when a new file is uploaded',
        appId: 'slack',
        config: {
          fields: [
            {
              key: 'channelName',
              label: 'Channel Name',
              type: 'text',
              placeholder: '#general',
              required: false
            }
          ]
        }
      }
    },
    actions: {
      sendMessage: {
        key: 'sendMessage',
        label: 'Send Message',
        description: 'Sends a message to a channel',
        appId: 'slack',
        config: {
          fields: [
            {
              key: 'channelName',
              label: 'Channel Name',
              type: 'text',
              placeholder: '#general',
              required: true
            },
            {
              key: 'message',
              label: 'Message',
              type: 'textarea',
              placeholder: 'Your message here...',
              required: true
            }
          ]
        }
      },
      createChannel: {
        key: 'createChannel',
        label: 'Create Channel',
        description: 'Creates a new channel',
        appId: 'slack',
        config: {
          fields: [
            {
              key: 'channelName',
              label: 'Channel Name',
              type: 'text',
              placeholder: 'new-channel',
              required: true
            },
            {
              key: 'isPrivate',
              label: 'Private Channel',
              type: 'checkbox',
              required: false
            }
          ]
        }
      }
    }
  },
  contacts: {
    id: 'contacts',
    name: 'Google Contacts',
    icon: '👤',
    color: 'bg-blue-100',
    triggers: {
      newContact: {
        key: 'newContact',
        label: 'New Contact',
        description: 'Triggers when a new contact is created',
        appId: 'contacts',
        config: {
          fields: [
            {
              key: 'group',
              label: 'Contact Group',
              type: 'text',
              placeholder: 'Work',
              required: false
            }
          ]
        }
      }
    },
    actions: {
      createContact: {
        key: 'createContact',
        label: 'Create Contact',
        description: 'Creates a new contact',
        appId: 'contacts',
        config: {
          fields: [
            {
              key: 'firstName',
              label: 'First Name',
              type: 'text',
              required: true
            },
            {
              key: 'lastName',
              label: 'Last Name',
              type: 'text',
              required: true
            },
            {
              key: 'email',
              label: 'Email',
              type: 'text',
              placeholder: 'email@example.com',
              required: true
            },
            {
              key: 'phone',
              label: 'Phone',
              type: 'text',
              placeholder: '+1234567890',
              required: false
            }
          ]
        }
      },
      updateContact: {
        key: 'updateContact',
        label: 'Update Contact',
        description: 'Updates an existing contact',
        appId: 'contacts',
        config: {
          fields: [
            {
              key: 'contactId',
              label: 'Contact ID',
              type: 'text',
              required: true
            },
            {
              key: 'email',
              label: 'New Email',
              type: 'text',
              placeholder: 'new-email@example.com',
              required: false
            },
            {
              key: 'phone',
              label: 'New Phone',
              type: 'text',
              placeholder: '+1234567890',
              required: false
            }
          ]
        }
      }
    }
  }
};