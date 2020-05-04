const mixinFuncoesGerais = {
    methods: {

        /**
         * Método que direciona para uma rota passada por parâmetro
         * @param {String} rota 
         */
        mxIrPara: function (rota) {
            this.$router.push('/' + rota);
        },

        /**
         * Método que retorna uma data no formado do banco de dados (date)
         * @param {Date} data 
         */
        mxGetDataBd: function (data) {
            return data.format('YYYY-MM-DD');
        },

        /**
         * Método que retorna uma data no formado do front
         * @param {Date} data 
         */
        mxGetData: function (data) {
            return data.format('DD-MM-YYYY');
        },

        /**
         * Método que retorna uma data no formado do front
         * @param {Date} data 
         */
        mxFormataDataBd: function (data) {

            if (data == null) {
                return;
            }

            const split = data.split('-');

            return split[2] + '/' + split[1] + '/' + split[0];
        }
    }
}

export default mixinFuncoesGerais;