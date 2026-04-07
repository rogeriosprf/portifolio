/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {

		var flexboxFixTimeoutId;

		$window.on('resize.flexbox-fix', function () {

			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(function () {

				if ($wrapper.prop('scrollHeight') > $window.height())
					$wrapper.css('height', 'auto');
				else
					$wrapper.css('height', '100vh');

			}, 250);

		}).triggerHandler('resize.flexbox-fix');

	}

	// Nav.
	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');

	// Keep nav layout deterministic via CSS grid (no template middle-split classes).

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function (id, initial) {

		var $article = $main_articles.filter('#' + id);

		// No such article? Bail.
		if ($article.length == 0)
			return;

		// Handle lock.

		// Already locked? Speed through "show" steps w/o delays.
		if (locked || (typeof initial != 'undefined' && initial === true)) {

			// Mark as switching.
			$body.addClass('is-switching');

			// Mark as visible.
			$body.addClass('is-article-visible');

			// Deactivate all articles (just in case one's already active).
			$main_articles.removeClass('active');

			// Hide header, footer.
			$header.hide();
			$footer.hide();

			// Show main, article.
			$main.show();
			$article.show();

			// Activate article.
			$article.addClass('active');

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(function () {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));

			return;

		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass('is-article-visible')) {

			// Deactivate current article.
			var $currentArticle = $main_articles.filter('.active');

			$currentArticle.removeClass('active');

			// Show article.
			setTimeout(function () {

				// Hide current article.
				$currentArticle.hide();

				// Show article.
				$article.show();

				// Activate article.
				setTimeout(function () {

					$article.addClass('active');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

		// Otherwise, handle as normal.
		else {

			// Mark as visible.
			$body
				.addClass('is-article-visible');

			// Show article.
			setTimeout(function () {

				// Hide header, footer.
				$header.hide();
				$footer.hide();

				// Show main, article.
				$main.show();
				$article.show();

				// Activate article.
				setTimeout(function () {

					$article.addClass('active');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

	};

	$main._hide = function (addState) {

		var $article = $main_articles.filter('.active');

		// Article not visible? Bail.
		if (!$body.hasClass('is-article-visible'))
			return;

		// Add state?
		if (typeof addState != 'undefined'
			&& addState === true)
			history.pushState(null, null, '#');

		// Handle lock.

		// Already locked? Speed through "hide" steps w/o delays.
		if (locked) {

			// Mark as switching.
			$body.addClass('is-switching');

			// Deactivate article.
			$article.removeClass('active');

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			$body.removeClass('is-article-visible');

			// Unlock.
			locked = false;

			// Unmark as switching.
			$body.removeClass('is-switching');

			// Window stuff.
			$window
				.scrollTop(0)
				.triggerHandler('resize.flexbox-fix');

			return;

		}

		// Lock.
		locked = true;

		// Deactivate article.
		$article.removeClass('active');

		// Hide article.
		setTimeout(function () {

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			setTimeout(function () {

				$body.removeClass('is-article-visible');

				// Window stuff.
				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');

				// Unlock.
				setTimeout(function () {
					locked = false;
				}, delay);

			}, 25);

		}, delay);


	};

	// Articles.
	$main_articles.each(function () {

		var $this = $(this);

		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function () {
				if ($this.attr('id') === 'siav-stack' || $this.attr('id') === 'bi-stack' || $this.attr('id') === 'data-stack')
					location.hash = 'intro';
				else
					location.hash = '';
			});

		// Prevent clicks from inside article from bubbling.
		$this.on('click', function (event) {
			event.stopPropagation();
		});

	});

	// Events.
	// Only close article on explicit close button click
	$main.on('click', '.close', function (event) {
		event.stopPropagation();

		var $activeArticle = $main_articles.filter('.active');
		if ($activeArticle.attr('id') === 'siav-stack' || $activeArticle.attr('id') === 'bi-stack' || $activeArticle.attr('id') === 'data-stack') {
			location.hash = 'intro';
			return false;
		}

		$main._hide(true);
	});

	$window.on('keyup', function (event) {

		switch (event.keyCode) {

			default:
				break;

		}

	});

	$window.on('hashchange', function (event) {

		// Empty hash?
		if (location.hash == ''
			|| location.hash == '#') {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$main._hide();

		}

		// Otherwise, check for a matching article.
		else if ($main_articles.filter(location.hash).length > 0) {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Show article.
			$main._show(location.hash.substr(1));

		}

	});

	// Scroll restoration.
	// This prevents the page from scrolling back to the top on a hashchange.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';
	else {

		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $('html,body');

		$window
			.on('scroll', function () {

				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();

			})
			.on('hashchange', function () {
				$window.scrollTop(oldScrollPos);
			});

	}

	// Initialize.

	// Hide main, articles.
	$main.hide();
	$main_articles.hide();

	// Initial article.
	if (location.hash != ''
		&& location.hash != '#')
		$window.on('load', function () {
			$main._show(location.hash.substr(1), true);
		});

	// Projects carousel.
	var $projectsCarousel = $('.projects-carousel');

	$projectsCarousel.each(function () {

		var $carousel = $(this),
			$track = $carousel.find('.carousel-track'),
			$slides = $carousel.find('.carousel-slide'),
			$dots = $carousel.find('.carousel-dot'),
			slideCount = $slides.length,
			index = 0;

		var goToSlide = function (nextIndex) {

			index = (nextIndex + slideCount) % slideCount;
			$track.css('transform', 'translateX(' + (-100 * index) + '%)');
			$dots.removeClass('is-active');
			$dots.eq(index).addClass('is-active');

		};

		$carousel.find('.carousel-btn.prev').on('click', function (event) {
			event.preventDefault();
			goToSlide(index - 1);
		});

		$carousel.find('.carousel-btn.next').on('click', function (event) {
			event.preventDefault();
			goToSlide(index + 1);
		});

		$dots.each(function (dotIndex) {
			$(this).on('click', function (event) {
				event.preventDefault();
				goToSlide(dotIndex);
			});
		});

		goToSlide(0);

	});

	// Demo modal carousel.
	var demoCarousels = {
		auditoria: [
			{ src: 'images/auditoria/cards.png', alt: 'Auditoria Image 1' },
			{ src: 'images/auditoria/home.png', alt: 'Auditoria Image 2' },
			{ src: 'images/auditoria/image.png', alt: 'Auditoria Image 3' },
			{ src: 'images/auditoria/modal.png', alt: 'Auditoria Image 4' }
		],
		bi: [
			{ src: 'images/bi/auditoria.png', alt: 'BI GovBR Image 1' },
			{ src: 'images/bi/distribuicao.png', alt: 'BI GovBR Image 2' },
			{ src: 'images/bi/orgaos.png', alt: 'BI GovBR Image 3' },
			{ src: 'images/bi/tendencias.png', alt: 'BI GovBR Image 4' }
		],
		data: [
			{ src: 'images/data/cube.png', alt: 'Data Engine Image 1' },
			{ src: 'images/data/etl.png', alt: 'Data Engine Image 2' },
			{ src: 'images/data/rag.png', alt: 'Data Engine Image 3' },
			{ src: 'images/data/upload.png', alt: 'Data Engine Image 4' }
		]
	};

	var $demoModal = $('#demo-modal'),
		$demoSlides = $demoModal.find('.demo-slide'),
		$demoCurrent = $demoModal.find('.demo-current'),
		$demoTotal = $demoModal.find('.demo-total'),
		$demoPrev = $demoModal.find('.demo-prev'),
		$demoNext = $demoModal.find('.demo-next'),
		$demoClose = $demoModal.find('.close, .demo-close-btn');

	var currentDemoIndex = 0,
		currentDemoImages = demoCarousels.auditoria;

	var renderDemoImages = function (images) {
		currentDemoImages = images;
		currentDemoIndex = 0;
		$demoSlides.each(function (idx) {
			var $slide = $(this),
				$img = $slide.find('img');

			if (idx < images.length) {
				$img.attr('src', images[idx].src).attr('alt', images[idx].alt);
				$slide.removeClass('hidden');
			} else {
				$slide.addClass('hidden');
			}

			$slide.removeClass('active');
		});

		$demoSlides.filter(':not(.hidden)').eq(0).addClass('active');
		$demoCurrent.text('1');
		$demoTotal.text(images.length);
	};

	var updateDemoSlide = function (direction) {
		if (!currentDemoImages.length) return;

		currentDemoIndex = (currentDemoIndex + direction + currentDemoImages.length) % currentDemoImages.length;
		$demoSlides.removeClass('active');
		$demoSlides.filter(':not(.hidden)').eq(currentDemoIndex).addClass('active');
		$demoCurrent.text(currentDemoIndex + 1);
	};

	$demoPrev.on('click', function (event) {
		event.preventDefault();
		updateDemoSlide(-1);
	});

	$demoNext.on('click', function (event) {
		event.preventDefault();
		updateDemoSlide(1);
	});

	$demoClose.on('click', function (event) {
		event.preventDefault();
		$demoModal.removeClass('is-open');
	});

	$(document).on('click', '.project-demo-btn', function (event) {
		event.preventDefault();
		event.stopPropagation();
		var key = $(this).data('demo');
		var images = demoCarousels[key] || demoCarousels.auditoria;

		renderDemoImages(images);
		$demoModal.addClass('is-open');
		return false;
	});

	// Prevent modal from closing when clicking inside it
	$demoModal.on('click', function (event) {
		event.stopPropagation();
	});

	// Language switcher.
	var $langSwitcher = $('.language-switcher');

	if ($langSwitcher.length > 0) {

		var translations = {
			pt: {
				htmlLang: 'pt-BR',
				pageTitle: 'Rogério Oliveira | Engenharia de Dados & Sistemas de Alta Escala',
				heroTitle: 'Arquitetura de Dados e Sistemas de Alta Performance<br />',
				heroSubtitle: 'Desenvolvimento de pipelines escaláveis, backends robustos e soluções de IA focadas em eficiência operacional e decisões baseadas em dados.',
				navIntro: 'Projetos',
				navWork: 'Stack',
				navAbout: 'Soluções',
				navContact: 'Contato',
				introTitle: 'Projetos',
				carouselLabel: 'Carrossel de projetos',
				carouselPrev: 'Projeto anterior',
				carouselNext: 'Próximo projeto',
				workTitle: 'Stack',
				projectStackLabel: 'Tecnologias',
				workSubtitle: 'Organizadas por especialidade.',
				workGroups: [
					{
						title: 'Engenharia de Dados',
						tags: ['Python', 'SQL', 'Rust', 'Polars', 'PySpark', 'PostgreSQL']
					},
					{
						title: 'Backend e APIs',
						tags: ['FastAPI', 'Node.js', 'REST APIs', 'SQL Server', 'Supabase']
					},
					{
						title: 'Cloud e Infra',
						tags: ['Azure', 'Docker', 'GitHub Actions', 'Linux', 'Vercel']
					},
					{
						title: 'IA Aplicada',
						tags: ['OpenAI API', 'Prompt Engineering', 'RAG', 'Automação de Fluxos', 'Streamlit', 'LLM Apps']
					}
				],
				aboutTitle: 'Soluções',
				aboutCards: [
					{
						title: 'Foco Atual',
						items: [
							'Arquitetura e engenharia de dados ponta a ponta.',
							'Aplicações com IA para automação e suporte à decisão.',
							'Backends e APIs para produtos digitais escaláveis.'
						]
					},
					{
						title: 'Como Trabalho',
						items: [
							'Diagnóstico do problema e definição de metas claras.',
							'Entrega incremental com validação contínua.',
							'Boas práticas de versionamento, testes e observabilidade.'
						]
					},
					{
						title: 'Tipos de Entrega',
						items: [
							'Pipelines de dados, dashboards e indicadores de negócio.',
							'APIs e serviços para integração entre sistemas.',
							'Protótipos e produtos com IA prontos para evolução.'
						]
					}
				],
				contactTitle: 'Contato',
				contactPhotoLabel: 'Sua foto aqui',
				footerCopy: '&copy; 2026 Rogério Oliveira<br />Engenharia de dados e soluções backend',
				close: 'Fechar',
				stackButton: 'Stack',
				liveNoteSiav: 'Nota: O carregamento inicial pode levar 40s (instância gratuita).',
				liveNoteBi: 'Nota: Servidor em repouso. Clique para acordar (Wake up) e<br />aguarde o carregamento inicial.',
				stackModal: {
					title: 'Documentação Técnica: SIAV (Sistema Inteligente de Auditoria de Viagens)',
					sections: [
						{
							title: '1. Visão Geral',
							paragraph: 'O SIAV é uma solução de auditoria de dados em larga escala que integra técnicas de Data Engineering com IA Generativa. O sistema automatiza a identificação de anomalias em gastos públicos, processando milhões de registros de viagens com foco em performance e precisão semântica.'
						},
						{
							title: '2. Arquitetura do Software (Clean Architecture)',
							paragraph: 'O projeto segue princípios de Domain-Driven Design (DDD) para garantir manutenibilidade e separação de interesses:',
							items: [
								'<strong>app/core:</strong> Gestão de configurações globais, logging estruturado e ciclo de vida da aplicação (startup/settings).',
								'<strong>app/domain:</strong> Contém a lógica de negócio central (audit.py), independente de frameworks ou ferramentas externas.',
								'<strong>app/infrastructure:</strong> Camada de baixo nível que gerencia o motor de dados (data_engine.py), integrações com LLM (groq_client.py) e geração de vetores (embedding.py).',
								'<strong>app/services:</strong> Orquestra a comunicação entre a infraestrutura e o domínio, realizando o processamento das auditorias.',
								'<strong>app/routers &amp; app/schemas:</strong> API baseada em contratos rigorosos para comunicação com o frontend e validação de dados.'
							]
						},
						{
							title: '3. Stack Tecnológica &amp; Engenharia de Dados',
							items: [
								'<strong>Linguagem Core:</strong> Python 3.13 (foco em performance e concorrência).',
								'<strong>Data Engine:</strong> Processamento vetorial e tratamento de datasets massivos (+1M registros).',
								'<strong>IA e RAG:</strong> Embeddings para busca de similaridade e detecção de padrões não óbvios; LLMs via Groq para análise qualitativa de justificativas de viagem com ultra-baixa latência.',
								'<strong>Frontend Reativo:</strong> SPA (Single Page Application) em Vanilla JS com arquitetura de estado inspirada em Redux (store/reducer), garantindo fluidez no dashboard.'
							]
						},
						{
							title: '4. Diferenciais de Implementação',
							items: [
								'<strong>Lazy Evaluation:</strong> Otimização de memória no tratamento de dados para evitar gargalos em hardware limitado.',
								'<strong>Segurança e Logs:</strong> Middleware de auditoria para rastreabilidade de todas as ações realizadas no sistema.',
								'<strong>Modularidade:</strong> Substituição facilitada de componentes de infraestrutura sem afetar a lógica de negócio.'
							]
						},
						{
							title: '5. Estrutura de Diretórios',
							tree: '├── app\n│   ├── core           # Configurações e Startup\n│   ├── domain         # Entidades e Regras de Negócio\n│   ├── infrastructure # Clientes API, BD e Engine de Dados\n│   ├── services       # Orquestração de Auditoria\n│   └── routers        # Endpoints da API\n└── static             # Dashboard Frontend (Estado Centralizado)'
						}
					]
				},
				projectButtons: ['Demo', 'GitHub', 'Case'],
				projects: [
					{
						title: 'SIAV | Sistema Inteligente de Auditoria de Viagens',
						description: 'Plataforma inteligente para auditoria de gastos públicos baseada em IA e processamento de alto desempenho.',
						challengeLabel: 'O Desafio:',
						challenge: 'Identificar anomalias em milhões de registros de viagens governamentais, superando a escala da análise manual humana.',
						solutionLabel: 'A Solução:',
						solution: 'Arquitetura robusta para +1M de registros integrada a LLMs e Embeddings para detecção semântica de padrões suspeitos e dashboards reativos.'
					},
					{
						title: 'BI de Viagens GOVBR | Visibilidade Estratégica de Gastos',
						description: 'Transformação de dados abertos governamentais em inteligência estratégica para gestão de recursos públicos.',
						challengeLabel: 'O Desafio:',
						challenge: 'Consolidar e limpar bases complexas de dados abertos para permitir que gestores visualizem a destinação real dos recursos de forma clara.',
						solutionLabel: 'A Solução:',
						solution: 'Painel analítico dinâmico com dashboards de alta performance que revelam tendências de gastos e custos excessivos em tempo real.'
					},
					{
						title: 'Data Engine | Processamento de Ultra Performance',
						description: 'Motor de ETL customizado para processamento massivo de dados com eficiência extrema de hardware.',
						challengeLabel: 'O Desafio:',
						challenge: 'Superar gargalos de memória e latência de ferramentas convencionais ao lidar com grandes volumes de dados (Big Data).',
						solutionLabel: 'A Solução:',
						solution: 'Engine desenvolvida em Rust e Polars, utilizando Lazy Evaluation e paralelismo para garantir processamento veloz com baixíssimo consumo de recursos.'
					}
				]
			},
			en: {
				htmlLang: 'en',
				pageTitle: 'Rogério Oliveira | Data Engineering & High-Scale Systems',
				heroTitle: 'Data Architecture and High-Performance Systems<br />',
				heroSubtitle: 'Development of scalable pipelines, robust backends, and AI solutions focused on operational efficiency and data-driven decisions.',
				navIntro: 'Projects',
				navWork: 'Stack',
				navAbout: 'Solutions',
				navContact: 'Contact',
				introTitle: 'Projects',
				carouselLabel: 'Projects carousel',
				carouselPrev: 'Previous project',
				carouselNext: 'Next project',
				workTitle: 'Stack',
				projectStackLabel: 'Technologies',
				workSubtitle: 'Organized by specialty.',
				workGroups: [
					{
						title: 'Data Engineering',
						tags: ['Python', 'SQL', 'Rust', 'Polars', 'PySpark', 'PostgreSQL']
					},
					{
						title: 'Backend and APIs',
						tags: ['FastAPI', 'Node.js', 'REST APIs', 'SQL Server', 'Supabase']
					},
					{
						title: 'Cloud and Infra',
						tags: ['Azure', 'Docker', 'GitHub Actions', 'Linux', 'Vercel']
					},
					{
						title: 'Applied AI',
						tags: ['OpenAI API', 'Prompt Engineering', 'RAG', 'Workflow Automation', 'Streamlit', 'LLM Apps']
					}
				],
				aboutTitle: 'Solutions',
				aboutCards: [
					{
						title: 'Current Focus',
						items: [
							'End-to-end data architecture and engineering.',
							'AI applications for automation and decision support.',
							'Backends and APIs for scalable digital products.'
						]
					},
					{
						title: 'How I Work',
						items: [
							'Problem diagnosis and clear goal definition.',
							'Incremental delivery with continuous validation.',
							'Best practices in versioning, testing, and observability.'
						]
					},
					{
						title: 'Delivery Types',
						items: [
							'Data pipelines, dashboards, and business KPIs.',
							'APIs and services for system integrations.',
							'AI prototypes and products ready to evolve.'
						]
					}
				],
				contactTitle: 'Contact',
				contactPhotoLabel: 'Your photo here',
				footerCopy: '&copy; 2026 Rogério Oliveira<br />Data engineering and backend solutions',
				close: 'Close',
				stackButton: 'Stack',
				liveNoteSiav: 'Note: Initial loading may take 40s (free instance).',
				liveNoteBi: 'Note: Server is sleeping. Click to wake it up and<br />wait for the initial load.',
				stackModal: {
					title: 'Technical Documentation: SIAV (Smart Travel Auditing System)',
					sections: [
						{
							title: '1. Overview',
							paragraph: 'SIAV is a large-scale data auditing solution that combines Data Engineering techniques with Generative AI. The system automates anomaly detection in public spending by processing millions of travel records with a focus on performance and semantic precision.'
						},
						{
							title: '2. Software Architecture (Clean Architecture)',
							paragraph: 'The project follows Domain-Driven Design (DDD) principles to ensure maintainability and separation of concerns:',
							items: [
								'<strong>app/core:</strong> Global configuration management, structured logging, and application lifecycle (startup/settings).',
								'<strong>app/domain:</strong> Contains the core business logic (audit.py), independent from frameworks or external tools.',
								'<strong>app/infrastructure:</strong> Low-level layer responsible for the data engine (data_engine.py), LLM integrations (groq_client.py), and vector generation (embedding.py).',
								'<strong>app/services:</strong> Orchestrates communication between infrastructure and domain, executing the audit workflows.',
								'<strong>app/routers &amp; app/schemas:</strong> Contract-driven API layer for frontend communication and data validation.'
							]
						},
						{
							title: '3. Technology Stack &amp; Data Engineering',
							items: [
								'<strong>Core Language:</strong> Python 3.13 (focused on performance and concurrency).',
								'<strong>Data Engine:</strong> Vectorized processing and handling of massive datasets (1M+ records).',
								'<strong>AI and RAG:</strong> Embeddings for similarity search and detection of non-obvious patterns; Groq-hosted LLMs for ultra-low-latency qualitative analysis of travel justifications.',
								'<strong>Reactive Frontend:</strong> Vanilla JS SPA with a Redux-inspired state architecture (store/reducer), ensuring dashboard fluidity.'
							]
						},
						{
							title: '4. Implementation Highlights',
							items: [
								'<strong>Lazy Evaluation:</strong> Memory optimization during data processing to avoid bottlenecks on limited hardware.',
								'<strong>Security and Logs:</strong> Audit middleware for traceability of all actions performed in the system.',
								'<strong>Modularity:</strong> Easy replacement of infrastructure components without affecting business logic.'
							]
						},
						{
							title: '5. Directory Structure',
							tree: '├── app\n│   ├── core           # Settings and Startup\n│   ├── domain         # Entities and Business Rules\n│   ├── infrastructure # API Clients, DB, and Data Engine\n│   ├── services       # Audit Orchestration\n│   └── routers        # API Endpoints\n└── static             # Frontend Dashboard (Centralized State)'
						}
					]
				},
				projectButtons: ['Demo', 'GitHub', 'Case Study'],
				projects: [
					{
						title: 'SIAV | Smart Travel Auditing System',
						description: 'Intelligent platform for auditing public spending powered by AI and high-performance processing.',
						challengeLabel: 'The Challenge:',
						challenge: 'Identify anomalies across millions of government travel records, beyond the scale of manual human review.',
						solutionLabel: 'The Solution:',
						solution: 'Robust architecture for 1M+ records integrated with LLMs and embeddings for semantic detection of suspicious patterns and reactive dashboards.'
					},
					{
						title: 'GOVBR Travel BI | Strategic Spending Visibility',
						description: 'Transformation of open government data into strategic intelligence for public resource management.',
						challengeLabel: 'The Challenge:',
						challenge: 'Consolidate and clean complex open-data sources so managers can clearly visualize the real allocation of public resources.',
						solutionLabel: 'The Solution:',
						solution: 'Dynamic analytical panel with high-performance dashboards that reveal spending trends and excessive costs in real time.'
					},
					{
						title: 'Data Engine | Ultra-Performance Processing',
						description: 'Custom ETL engine for massive data processing with extreme hardware efficiency.',
						challengeLabel: 'The Challenge:',
						challenge: 'Overcome memory and latency bottlenecks of conventional tools when handling large-scale data volumes (Big Data).',
						solutionLabel: 'The Solution:',
						solution: 'Engine built with Rust and Polars, using lazy evaluation and parallelism to ensure fast processing with very low resource consumption.'
					}
				]
			}
		};

		var fadeTimeoutId = null;

		var configureProjectLinks = function (lang) {
			var t = translations[lang] || translations.pt;

			$('#intro .carousel-slide').each(function (index) {
				var $slide = $(this),
					$actionButtons = $slide.find('.actions .button');

				// Add links for first project (SIAV Auditoria)
				if (index === 0) {
					$actionButtons.eq(1).text('Stack');
					$actionButtons.eq(1).attr('href', '#siav-stack');
					$actionButtons.eq(1).removeAttr('target');
					$actionButtons.eq(1).removeAttr('rel');
					$actionButtons.eq(2).attr('href', 'https://github.com/rogeriosprf/GOVBR-Auditoria');
					$actionButtons.eq(2).attr('target', '_blank');
					$actionButtons.eq(2).attr('rel', 'noopener noreferrer');
					$actionButtons.eq(3).text('Live');
					$actionButtons.eq(3).attr('href', 'https://govbr-auditoria.onrender.com/');
					$actionButtons.eq(3).attr('target', '_blank');
					$actionButtons.eq(3).attr('rel', 'noopener noreferrer');
				}

				// Add links for second project (BI GovBR)
				if (index === 1) {
					$actionButtons.eq(1).text('Stack');
					$actionButtons.eq(1).attr('href', '#bi-stack');
					$actionButtons.eq(1).removeAttr('target');
					$actionButtons.eq(1).removeAttr('rel');
					$actionButtons.eq(2).attr('href', 'https://github.com/rogeriosprf/GOVBR-Viagens-BI');
					$actionButtons.eq(2).attr('target', '_blank');
					$actionButtons.eq(2).attr('rel', 'noopener noreferrer');
					$actionButtons.eq(3).text('Live');
					$actionButtons.eq(3).attr('href', 'https://govbr-viagens-bi-dnhntcgnzbsvbare9zbtbj.streamlit.app/');
					$actionButtons.eq(3).attr('target', '_blank');
					$actionButtons.eq(3).attr('rel', 'noopener noreferrer');
				}

				// Add links for third project (Data Engine)
				if (index === 2) {
					$actionButtons.eq(1).text('Stack');
					$actionButtons.eq(1).attr('href', '#data-stack');
					$actionButtons.eq(1).removeAttr('target');
					$actionButtons.eq(1).removeAttr('rel');
					$actionButtons.eq(2).attr('href', 'https://github.com/rogeriosprf/GOVBR-Data-Engine');
					$actionButtons.eq(2).attr('target', '_blank');
					$actionButtons.eq(2).attr('rel', 'noopener noreferrer');
				}
			});

			// Reattach demo button handlers after configuration
			$('.project-demo-btn').off('click.demoBtn').on('click.demoBtn', function (event) {
				event.preventDefault();
				event.stopPropagation();
				var key = $(this).data('demo');
				var images = demoCarousels[key] || demoCarousels.auditoria;
				renderDemoImages(images);
				$('#demo-modal').addClass('is-open');
				return false;
			});
		};

		var applyLanguage = function (lang) {

			var t = translations[lang] || translations.pt;

			document.title = t.pageTitle;
			$('html').attr('lang', t.htmlLang);
			$('#hero-title').html(t.heroTitle);
			$('#hero-subtitle').html(t.heroSubtitle);
			$('#nav-intro').text(t.navIntro);
			$('#nav-work').text(t.navWork);
			$('#nav-about').text(t.navAbout);
			$('#nav-contact').text(t.navContact);
			$('#intro-title').text(t.introTitle);

			$projectsCarousel.attr('aria-label', t.carouselLabel);
			$projectsCarousel.find('.carousel-btn.prev').attr('aria-label', t.carouselPrev);
			$projectsCarousel.find('.carousel-btn.next').attr('aria-label', t.carouselNext);
			$('#intro .carousel-slide').eq(0).find('.project-live-note').html(t.liveNoteSiav);
			$('#intro .carousel-slide').eq(1).find('.project-live-note').html(t.liveNoteBi);
			$projectsCarousel.find('.carousel-dot').each(function (dotIndex) {
				$(this).attr('aria-label', t.introTitle + ' ' + (dotIndex + 1));
			});

			$('#intro .carousel-slide').each(function (index) {

				var project = t.projects[index],
					$slide = $(this),
					$actionButtons = $slide.find('.actions .button');

				if (!project)
					return;

				if ($slide.find('.project-title-text').length > 0)
					$slide.find('.project-title-text').text(project.title);
				else
					$slide.find('h3').text(project.title);

				if (index === 0 || index === 1 || index === 2) {
					if (project.description)
						$slide.find('.project-description').text(project.description);
					$slide.find('.project-challenge-label').text(project.challengeLabel);
					$slide.find('.project-challenge-text').text(project.challenge);
					$slide.find('.project-solution-label').text(project.solutionLabel);
					$slide.find('.project-solution-text').text(project.solution || '');

				}
				else {
					$slide.find('p').eq(0).text(project.description);
					$slide.find('.project-stack').html('<strong>' + t.projectStackLabel + ':</strong> ' + project.stack);
				}

				// Preserve demo button attributes and only update text for non-demo buttons
				if (index === 0 || index === 1) {
					$actionButtons.eq(0).text(t.projectButtons[0]);
					$actionButtons.eq(1).text(t.stackButton);
					$actionButtons.eq(2).text(t.projectButtons[1]);
					$actionButtons.eq(3).text(t.projectButtons[2]);
				} else if (index === 2) {
					$actionButtons.eq(0).text(t.projectButtons[0]);
					$actionButtons.eq(1).text(t.stackButton);
					$actionButtons.eq(2).text(t.projectButtons[1]);
				} else if ($actionButtons.eq(0).hasClass('project-demo-btn')) {
					// Keep demo button as is
					$actionButtons.eq(1).text(t.projectButtons[1]);
					$actionButtons.eq(2).text(t.projectButtons[2]);
				} else {
					// Update all button texts if no demo button
					$actionButtons.eq(0).text(t.projectButtons[0]);
					$actionButtons.eq(1).text(t.projectButtons[1]);
					$actionButtons.eq(2).text(t.projectButtons[2]);
				}

			});

			// Configure project-specific links after translation
			configureProjectLinks(lang);

			var $demoModal = $('#demo-modal');
			var $demoSlides = $demoModal.find('.modal-image-slide');
			var demoTotal = $demoSlides.length;
			var demoCurrentIndex = 0;

			var showDemoImage = function (index) {
				if (index < 0)
					index = demoTotal - 1;
				if (index >= demoTotal)
					index = 0;

				demoCurrentIndex = index;
				$demoSlides.removeClass('active').eq(index).addClass('active');
				$demoModal.find('.demo-current').text(index + 1);
				$demoModal.find('.demo-total').text(demoTotal);
			};

			$demoModal.find('.demo-prev').off('click.demoNav').on('click.demoNav', function (e) {
				e.preventDefault();
				showDemoImage(demoCurrentIndex - 1);
			});

			$demoModal.find('.demo-next').off('click.demoNav').on('click.demoNav', function (e) {
				e.preventDefault();
				showDemoImage(demoCurrentIndex + 1);
			});

			$demoModal.find('.close').off('click.demoClose').on('click.demoClose', function () {
				$demoModal.removeClass('is-open');
				$('#header nav a').css('pointer-events', 'auto');
			});

			$('#work-title').text(t.workTitle);
			$('#work-subtitle').text(t.workSubtitle);
			$('#work .stack-group').each(function (index) {
				var group = t.workGroups[index],
					$group = $(this);

				if (!group)
					return;

				$group.find('h3').text(group.title);
				$group.find('.stack-tags li').each(function (tagIndex) {
					$(this).text(group.tags[tagIndex] || '');
				});
			});

			$('#about-title').text(t.aboutTitle);
			$('#about .about-card').each(function (cardIndex) {

				var card = t.aboutCards[cardIndex],
					$card = $(this);

				if (!card)
					return;

				$card.find('h3').text(card.title);
				$card.find('li').each(function (itemIndex) {
					$(this).text(card.items[itemIndex]);
				});

			});

			$('#contact-title').text(t.contactTitle);
			$('#contact-photo-label').text(t.contactPhotoLabel);
			$('#footer-copy').html(t.footerCopy);
			$('#main article .close').text(t.close);

			$langSwitcher.find('.lang-btn').removeClass('is-active').attr('aria-pressed', 'false');
			$langSwitcher.find('.lang-btn[data-lang="' + lang + '"]').addClass('is-active').attr('aria-pressed', 'true');

			try {
				window.localStorage.setItem('preferred-language', lang);
			}
			catch (error) { }

		};

		var setLanguage = function (lang, animate) {

			if (typeof animate === 'undefined')
				animate = true;

			if (!translations[lang])
				lang = 'pt';

			if (!animate) {
				applyLanguage(lang);
				return;
			}

			if (fadeTimeoutId)
				clearTimeout(fadeTimeoutId);

			$body.addClass('is-language-fading');

			fadeTimeoutId = setTimeout(function () {
				applyLanguage(lang);
				$body.removeClass('is-language-fading');
				fadeTimeoutId = null;
			}, 140);

		};

		var preferredLanguage = 'pt';

		try {
			preferredLanguage = window.localStorage.getItem('preferred-language') || preferredLanguage;
		}
		catch (error) { }

		if (!translations[preferredLanguage])
			preferredLanguage = 'pt';

		setLanguage(preferredLanguage, false);

		$langSwitcher.find('.lang-btn').on('click', function (event) {
			event.preventDefault();
			setLanguage($(this).attr('data-lang'), true);
		});

	}

})(jQuery);
