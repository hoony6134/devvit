import { Devvit } from '@devvit/public-api';

import Settings from '../settings.json';
import { generateRandomArray } from '../utils/generateRandomArray.js';

interface DrawingProps {
  data?: number[];
  size?: number;
  onPress?: Devvit.Blocks.OnPressEventHandler;
}

export const Drawing = (props: DrawingProps): JSX.Element => {
  const dummyData = generateRandomArray(Settings.resolution * Settings.resolution);
  const { data = dummyData, size = 288, onPress } = props;
  const shadowOffset = 4;
  const height: Devvit.Blocks.SizeString = `${size + shadowOffset}px`;
  const width: Devvit.Blocks.SizeString = `${size + shadowOffset}px`;

  function indexToXY(index: number, resolution: number): { x: number; y: number } {
    return {
      x: index % resolution,
      y: Math.floor(index / resolution),
    };
  }

  // Group pixels by color
  const colorGroups: { [colorIndex: number]: { x: number; y: number }[] } = {};
  data.forEach((colorIndex, pixelIndex) => {
    if (colorIndex > 0) {
      colorGroups[colorIndex] ??= [];
      colorGroups[colorIndex].push(indexToXY(pixelIndex, Settings.resolution));
    }
  });

  // Create paths for each color group
  const paths = Object.entries(colorGroups).map(([colorIndex, pixels]) => {
    const pathData = pixels.map(({ x, y }) => `M${x},${y}h1v1h-1z`).join(' ');
    return `<path d="${pathData}" fill="${Settings.colors[parseInt(colorIndex)]}" />`;
  });

  const svgString = `data:image/svg+xml,
<svg width="${Settings.resolution}" height="${Settings.resolution}" viewBox="0 0 ${Settings.resolution} ${Settings.resolution}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${Settings.resolution}" height="${Settings.resolution}" fill="white" />
  ${paths}
</svg>`;

  return (
    <zstack height={height} width={width} onPress={onPress}>
      {/* Shadow */}
      <vstack height={height} width={width}>
        <spacer height="4px" />
        <hstack grow>
          <spacer width="4px" />
          <hstack grow backgroundColor={Settings.theme.shadow} />
        </hstack>
      </vstack>

      {/* Card */}
      <vstack height={height} width={width}>
        <hstack grow>
          <image
            imageWidth={size}
            imageHeight={size}
            height={`${size}px`}
            width={`${size}px`}
            description="Drawing"
            resizeMode="fill"
            url={svgString}
          />
          <spacer width="4px" />
        </hstack>
        <spacer height="4px" />
      </vstack>
    </zstack>
  );
};
