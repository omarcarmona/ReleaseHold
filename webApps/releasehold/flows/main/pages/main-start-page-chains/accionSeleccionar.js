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

  class accionSeleccionar extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any[]} params.keys 
     * @param {any} params.selected 
     */
    async run(context, { keys, selected }) {
      const { $page, $flow, $application } = context;

    

      $page.variables.ordenesSelec = keys.toString();
    }
  }

  return accionSeleccionar;
});
