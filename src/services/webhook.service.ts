class WebhookService {
    async demo() {
        return {
            payment: "success",
            amount: 1000,
            currency: "USD",
            method: "transfer"
        };
    }
}

export default new WebhookService();
