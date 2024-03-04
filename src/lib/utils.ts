import type { Deposit, DepositForm, Withdrawal, WithdrawalForm } from './types'

export const day = 24 * 60 * 60 * 1000
export const week = 7 * day
export const year = 365.25 * day
export const month = year / 12

function checkInt(x: number) {
	return (x | 0) === x
}

export function isInt(value: unknown) {
	return (
		!isNaN(Number(value)) &&
		((typeof value === 'string' && checkInt(parseFloat(value))) ||
			(typeof value === 'number' && checkInt(value)))
	)
}

export function getElementFromArray<T>(array: T[], index: unknown): T | undefined {
	if (isInt(index)) {
		const i = index as number
		if (i >= 0 && i < array.length) {
			return array[i]
		}
	}
	return undefined
}

export function initializeForm<T extends Deposit | Withdrawal>(
	array: T[],
	index: unknown,
): DepositForm | WithdrawalForm {
	const d = getElementFromArray(array, index)
	if (d && d.isRecurring) {
		return {
			...d,
			startDate: formatDate(new Date(d.startDate)),
			endDate: formatDate(new Date(d.endDate)),
		}
	}
	if (d) {
		return {
			...d,
			startDate: formatDate(new Date(d.startDate)),
		}
	}
	return {
		name: '',
		amount: 0,
		startDate: formatDate(new Date()),
		isRecurring: false,
	}
}

export function formatDate(date: Date): string {
	// Extract year, month, and day components
	const year = date.getFullYear().toFixed()
	const month = (date.getMonth() + 1).toFixed().padStart(2, '0')
	const day = date.getDate().toFixed().padStart(2, '0')

	// Format the date components into "yyyy-MM-dd" format
	return `${year}-${month}-${day}`
}

const base64abc = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'_',
	'-',
]

const base64codes = (() => {
	const l = 256
	const base64codes = new Uint8Array(l)
	for (let i = 0; i < l; ++i) {
		base64codes[i] = 255 // invalid character
	}
	base64abc.forEach((char, index) => {
		base64codes[char.charCodeAt(0)] = index
	})
	base64codes['='.charCodeAt(0)] = 0 // ignored anyway, so we just need to prevent an error
	return base64codes
})()

function getBase64Code(charCode: number) {
	if (charCode >= base64codes.length) {
		throw new Error('Unable to parse base64 string (code beyond length).')
	}
	const code = base64codes[charCode]!
	if (code === 255) {
		throw new Error('Unable to parse base64 string (invalid code).')
	}
	return code
}

export function bytesToBase64(bytes: Uint8Array) {
	let result = ''
	let i
	const l = bytes.length
	for (i = 2; i < l; i += 3) {
		result += base64abc[bytes[i - 2]! >> 2]
		result += base64abc[((bytes[i - 2]! & 0x03) << 4) | (bytes[i - 1]! >> 4)]
		result += base64abc[((bytes[i - 1]! & 0x0f) << 2) | (bytes[i]! >> 6)]
		result += base64abc[bytes[i]! & 0x3f]
	}
	if (i === l + 1) {
		// 1 octet yet to write
		result += base64abc[bytes[i - 2]! >> 2]
		result += base64abc[(bytes[i - 2]! & 0x03) << 4]
		result += '=='
	}
	if (i === l) {
		// 2 octets yet to write
		result += base64abc[bytes[i - 2]! >> 2]
		result += base64abc[((bytes[i - 2]! & 0x03) << 4) | (bytes[i - 1]! >> 4)]
		result += base64abc[(bytes[i - 1]! & 0x0f) << 2]
		result += '='
	}
	return result
}

export function base64ToBytes(str: string) {
	if (str.length % 4 !== 0) {
		throw new Error('Unable to parse base64 string (invalid length).')
	}
	const index = str.indexOf('=')
	if (index !== -1 && index < str.length - 2) {
		throw new Error('Unable to parse base64 string (octets).')
	}
	const missingOctets = str.endsWith('==') ? 2 : str.endsWith('=') ? 1 : 0
	const n = str.length
	const result = new Uint8Array(3 * (n / 4))
	let buffer
	for (let i = 0, j = 0; i < n; i += 4, j += 3) {
		buffer =
			(getBase64Code(str.charCodeAt(i)) << 18) |
			(getBase64Code(str.charCodeAt(i + 1)) << 12) |
			(getBase64Code(str.charCodeAt(i + 2)) << 6) |
			getBase64Code(str.charCodeAt(i + 3))
		result[j] = buffer >> 16
		result[j + 1] = (buffer >> 8) & 0xff
		result[j + 2] = buffer & 0xff
	}
	return result.subarray(0, result.length - missingOctets)
}

export function base64encode(str: string, encoder = new TextEncoder()) {
	return bytesToBase64(encoder.encode(str))
}

export function base64decode(str: string, decoder = new TextDecoder()) {
	return decoder.decode(base64ToBytes(str))
}
