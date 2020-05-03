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
    }
}

export default mixinFuncoesGerais;