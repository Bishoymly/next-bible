# Bible Reader

An open-source, modern web application for reading and studying the Bible with multiple translations, study tools, and cross-references. Built with Next.js 16 and React 19.

## 🌟 Features

- **Multiple Bible Translations**: Support for BSB, KJV, ASV, and Arabic (AVD) translations
- **Study Tools**: 
  - Chapter-by-chapter commentary and important verses
  - Cross-references between verses
  - Book introductions and section breakdowns
- **Reading Experience**:
  - Side-by-side translation comparison
  - Verse-by-verse reading mode
  - Smooth page transitions and animations
  - Responsive design for mobile and desktop
- **Accessibility**:
  - Dark/light theme support
  - RTL (Right-to-Left) support for Arabic
  - Screen reader friendly
  - Keyboard navigation
- **Modern UI**:
  - Leather-textured design theme
  - Smooth animations and transitions
  - Intuitive navigation
  - Mobile-optimized sidebar

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks and local storage
- **Type Safety**: TypeScript
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/next-bible.git
   cd next-bible
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
next-bible/
├── app/                    # Next.js App Router pages
│   ├── [version]/         # Dynamic routes for Bible versions
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── bible-reader.tsx  # Main Bible reading component
│   └── ...
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
│   └── data/            # Bible text data (USFM format)
└── package.json         # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📖 Data Sources

This project uses the following open-source data:

- **Strong's Concordance**: [Open Scriptures Strong's](https://github.com/openscriptures/strongs)
- **Cross References**: [@texttree/bible-crossref](https://github.com/hiscoder-com/bible-crossref)
- **Bible Text**: USFM (Unified Standard Format Markers) format files
- **Berean Standard Bible (BSB)**: [BSB-publishing/bsb2usfm](https://github.com/BSB-publishing/bsb2usfm) (public domain)

## 🤝 Contributing

Contributions are welcome! This is an open-source project, and we appreciate any help you can provide.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

### Areas for Contribution

- Adding new Bible translations
- Improving accessibility
- Enhancing mobile experience
- Adding new study features
- Bug fixes and performance improvements
- Documentation improvements
- Translation/localization support

## 📝 License

This project is open source. Please check the LICENSE file for details.

## 🙏 Acknowledgments

- Open Scriptures for Strong's Concordance data
- TextTree for cross-reference data
- All contributors and users of this project

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🌐 Live Demo

Visit [www.holybiblereader.com](https://www.holybiblereader.com) to see the application in action.

---

Made with ❤️ for the Bible reading community
