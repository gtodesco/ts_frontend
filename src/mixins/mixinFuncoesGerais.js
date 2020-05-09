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
         * Método que formata uma string de data do formato do banco para o formato do front
         * @param {String} data 
         */
        mxFormataDataBd: function (data) {

            if (data == null) {
                return;
            }

            const split = data.split('-');

            return split[2] + '/' + split[1] + '/' + split[0];
        },

        /**
         * Método que formata uma string de tempo do formato do banco para o formato do front
         * @param {String} time 
         */
        mxFormataTimeBd: function (time) {
            if (time == null) {
                return;
            }

            const split = time.split(':');

            return split[0] + ':' + split[1];
        },
    }
}

export default mixinFuncoesGerais;