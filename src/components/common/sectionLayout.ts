import { SxProps } from '@suid/system';

export const sectionSx: SxProps = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	position: 'relative',
	overflow: 'hidden',
	width: '100%',
	minHeight: { xs: 'auto', md: '1200px' },
	px: { xs: 2, sm: 4 },
	py: { xs: 6, md: 8 },
	mt: { xs: 4, md: 6 },
	mx: 'auto',
	'& .display-grid': {
		display: 'grid',
		gap: { xs: 2, sm: 3 },
		width: '100%'
	}
};

export const headingSx: SxProps = {
	fontWeight: 700,
	mb: { xs: 3, md: 4 },
	textAlign: 'center',
	background: 'linear-gradient(90deg,#fff,#888)',
	WebkitBackgroundClip: 'text',
	color: 'transparent',
	letterSpacing: '.5px'
};
