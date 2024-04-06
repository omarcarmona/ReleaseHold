define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class ButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $fragment, $application } = context;

      await Actions.fireNotificationEvent(context, {
        summary: 'Hola',
      });

      await Actions.logout(context, {});
    }
  }

  return ButtonActionChain;
});
