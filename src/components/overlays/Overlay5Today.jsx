import React from 'react'
import MilestoneSlide from '../MilestoneSlide'
import { SLIDES } from '../../scene/assets'

export default function Overlay5Today({ onClose }) {
  return <MilestoneSlide src={SLIDES[5]} onClose={onClose} />
}
