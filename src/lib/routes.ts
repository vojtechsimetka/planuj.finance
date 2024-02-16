export default {
	HOME: '/',
	DEPOSIT: (index?: number) => `/deposit${index === undefined ? '' : `/${index}`}`,
	WITHDRAWAL: (index?: number) => `/withdrawal${index === undefined ? '' : `/${index}`}`,
}
