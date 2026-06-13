import React from 'react'
import MilestoneSlide from '../MilestoneSlide'
import { SLIDES } from '../../scene/assets'

export default function Overlay2WhenWeBegan({ onClose }) {
  return <MilestoneSlide src={SLIDES[2]} onClose={onClose} />
}
