export const flatVertex = 
   `#version 300 es
   precision highp float;
   layout(location = 0) in highp vec3 vertex;
   uniform mat4 model_view;
   uniform mat4 projection;
   uniform highp vec3 color;
   out vec4 vertex_color;
   void main() {
      gl_Position = projection * model_view * vec4(vertex, 1.0);       
      vertex_color = vec4(color, 1.0);
   }`;

export const flatFrag = 
   `#version 300 es
   precision highp float;
   in vec4 vertex_color;
   out vec4 fragColor;
   void main() {
      fragColor = vertex_color;
   }`

export const scalarFieldVertex =
   `#version 300 es
   precision highp float;
   layout(location = 0) in highp vec3 vertex;
   layout(location = 1) in highp vec3 normal;
   layout(location = 3) in float scalar_value;
   uniform mat4 eye_from_model;
   uniform mat4 ndc_from_eye;
   out float frag_scalar_value;
   void main(void) {
      gl_Position = ndc_from_eye * eye_from_model * vec4(vertex, 1.0);
      frag_scalar_value = scalar_value;
   }`;

export const scalarFieldFrag = 
   `#version 300 es
   precision highp float;
   const highp vec4 low_color = vec4(0.0, 0.0, 0.7, 1.0);
   const highp vec4 high_color = vec4(0.5, 0.0, 0.0, 1.0);
   const int number_of_bins = 14;
   uniform highp vec3 color_range[number_of_bins];
   uniform float color_values[number_of_bins + 1];
   uniform float min_value;
   uniform float max_value;
   uniform bool is_discrete_colors;
   in float frag_scalar_value;
   out vec4 fragColor;
   void main() {
      highp vec4 mapped_color = vec4(0.0, 0.0, 0.0, 1.0);
      if(frag_scalar_value < min_value) {
         mapped_color = low_color;
      }
      else if(frag_scalar_value > max_value) {
         mapped_color = high_color;
      }
      else {
         int bin_index = 0;
         for(int i=0; i < number_of_bins; i++) {
            if (frag_scalar_value <= color_values[i+1]) {
               bin_index = i;
               break;
            }
         }
         if(is_discrete_colors) {
            mapped_color = vec4(color_range[bin_index], 1);
         }
         else {
            float bin_size = color_values[bin_index+1] - color_values[bin_index];
            float bin_center = color_values[bin_index] + 0.5 * bin_size;
            float interpolator = 0.0;
            int other_bin_index = bin_index;
            if(frag_scalar_value > bin_center && bin_index < number_of_bins - 1) {
               interpolator = (frag_scalar_value - bin_center) / bin_size;
               other_bin_index = bin_index + 1;
            }
            else if(frag_scalar_value <= bin_center && bin_index > 0) {
               interpolator = (bin_center - frag_scalar_value) / bin_size;
               other_bin_index = bin_index - 1;
            }
            mapped_color = vec4(mix(color_range[bin_index], color_range[other_bin_index], interpolator), 1);
         }
      }
      if(mapped_color.w < 0.5) {
         discard;
      }
      fragColor = vec4(1.0, 0.0, 0.0, 1.0);
   }`;

export const shaderTypes = [
	{
		name: "flat",
		vertex: flatVertex,
		fragment: flatFrag
		attribNames: []
	},
	{
		name: "pick",
		vertex: flatVertex,
		fragment: flatFrag
		attribNames: []
	},
	{
		name: "scalarField",
		vertex: scalarFieldVertex,
		fragment: scalarFieldFrag,
		attribs: [
			{
				name: "scalar_value",
				infos: attribInfos.scalar_value
			}
		]
	}
]

export const attribInfos = {
	color: {
		nComponent: 3,
		location: 1
	},
	normal: {
		nComponent: 3,
		location: 2
	},
	scalar_value: {
		nComponent: 1,
		location: 3
	}
}