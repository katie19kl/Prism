const Major = {
	Undefined: undefined,
    Software: "software",
    Reserach: "research",
    Firmware: "firmware",
    Validation: "validation",
    Network: "network",
};

const majors = [
	{
		value: Major.Undefined,
		label: "None"
	},
    {
        value: Major.Software,
        label: 'Software',
    },
    {
        value: Major.Reserach,
        label: 'Research',
    },
    {
        value: Major.Firmware,
        label: 'Firmware',
    },
    {
        value: Major.Validation,
        label: 'Validation',
    },
    {
        value: Major.Network,
        label: 'Network',
    },
];

export { Major, majors };